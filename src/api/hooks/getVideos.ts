import { useQuery } from "@tanstack/react-query";
import { VideoService } from "../endpoints/videos";
import { useEffect, useRef } from "react";

interface VideoItem {
  video_id: string;
  thumbnail_url?: string;
  [key: string]: unknown;
}

type PatchFn = (videoId: string, thumbnailUrl: string) => void;

export const useAllVideos = () => {
  return useQuery({
    queryKey: ["all-videos"],
    queryFn: () => VideoService.getAllVideos(),
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
      .filter((v) => !v.thumbnail_url)
      .map((v) => v.video_id);

    if (!pendingIds.length) return;

    const params = new URLSearchParams();
    pendingIds.forEach((id) => params.append("video_ids", id));

    const url = `/videos/thumbnails/progress?${params.toString()}`;
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;
    // Add these immediately after creating es:
    console.log("ESopening to:", url);
    es.onopen = () => console.log("ES opened, readyState:", es.readyState);
    es.onerror = (e) => console.log("ES error, readyState:", es.readyState, e);
    es.addEventListener("ping", () => {
      console.log("SSE connected"); // remove after confirming
    });

    es.addEventListener("thumbnail_ready", (e: MessageEvent) => {
      console.log("Thumbnail ready event received:", e.data);
      const { video_id, thumbnail_url } = JSON.parse(e.data);
      onPatchRef.current(video_id, thumbnail_url);
    });

    es.addEventListener("done", () => {
      es.close();
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        es.close();
      }
    };

    return () => {
      es.close();
    };

    // ✅ Keyed on pending ids — re-runs as thumbnails resolve
  }, [
    videos
      ?.filter((v) => !v.thumbnail_url)
      .map((v) => v.video_id)
      .join(","),
  ]);
}
