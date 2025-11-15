import { useQuery } from "@tanstack/react-query";
import {VideoService} from "../endpoints/videos";

export const useAllVideos = () => {
  return useQuery({
    queryKey: ["all-videos"],
    queryFn: () => VideoService.getAllVideos(),
    staleTime: 60 * 1000, // optional: cache for 1 minute
  });
};