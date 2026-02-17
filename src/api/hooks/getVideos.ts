import { useQuery } from "@tanstack/react-query";
import { VideoService } from "../endpoints/videos";

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
