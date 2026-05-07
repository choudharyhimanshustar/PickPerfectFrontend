import { useQuery,useMutation  } from "@tanstack/react-query";
import { VideoService } from "../endpoints/videos";
import { useEffect, useRef } from "react";

interface VideoItem {
  video_id: string;
  filename: string;
  thumbnail_url: string | null;
  thumbnail_status: "ready" | "failed" | "processing";
}

type PatchFn = (videoId: string, thumbnailUrl: string | null, status?: "ready" | "failed") => void;

export const useAllVideos = () => {
  return useQuery({
    queryKey: ["all-videos"],
    queryFn: () => {
      console.log("[useAllVideos] queryFn fired");
      return VideoService.getAllVideos();
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useVideoAnalysis = (videoId: string) => {
  return useQuery({
    queryKey: ["video-analysis", videoId],
    queryFn: () => VideoService.getVideoAnalysis(videoId),
    enabled: !!videoId,
  });
};

export function useThumbnailSSE(videos: VideoItem[], onPatch: PatchFn) {
  const esRef = useRef<EventSource | null>(null);
  const onPatchRef = useRef(onPatch);
  useEffect(() => {
    onPatchRef.current = onPatch;
  }, [onPatch]);

  useEffect(() => {
    if (!videos?.length) return;

    const pendingIds = videos
      .filter((v) => !v.thumbnail_url && v.thumbnail_status !== "failed")  // ← skip already-failed
      .map((v) => v.video_id);

    if (!pendingIds.length) return;

    const params = new URLSearchParams();
    pendingIds.forEach((id) => params.append("video_ids", id));

    const url = `/videos/thumbnails/progress?${params.toString()}`;
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => console.log("ES opened, readyState:", es.readyState);
    es.onerror = (e) => console.log("ES error, readyState:", es.readyState, e);

    es.addEventListener("ping", () => {
      console.log("SSE connected");
    });

    es.addEventListener("thumbnail_ready", (e: MessageEvent) => {
      const { video_id, thumbnail_url } = JSON.parse(e.data);
      onPatchRef.current(video_id, thumbnail_url, "ready");
    });

    // ← NEW
    es.addEventListener("thumbnail_failed", (e: MessageEvent) => {
      const { video_id } = JSON.parse(e.data);
      onPatchRef.current(video_id, null, "failed");  // null url, failed status
    });

    es.addEventListener("done", () => es.close());

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) es.close();
    };

    return () => es.close();

  }, [
    videos
      ?.filter((v) => !v.thumbnail_url && v.thumbnail_status !== "failed")  // ← skip failed
      .map((v) => v.video_id)
      .join(","),
  ]);
}

export function useRetryThumbnail(
  onOptimisticUpdate: (videoId: string) => void,
  onError: (videoId: string) => void,
) {
  return useMutation({
    mutationFn: (videoId: string) => VideoService.retryThumbnail(videoId),

    onMutate: (videoId) => {
      // optimistically flip to processing before request fires
      onOptimisticUpdate(videoId);
    },

    onError: (_err, videoId) => {
      // revert back to failed if request fails
      onError(videoId);
    },
  });
}