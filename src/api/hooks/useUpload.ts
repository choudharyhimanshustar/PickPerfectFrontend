"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPresignedUrl,
  uploadToS3,
  videoUploadComplete,
} from "../endpoints/upload";
import { useQueryClient } from "@tanstack/react-query";
import { VideoService } from "../endpoints/videos";

interface UploadParams {
  file: File;
  url: string;
  metadata?: {
    title: string;
    description: string;
  };
}

export const usePresignedUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getPresignedUrl,
    // onSuccess: () => {
    //   queryClient.refetchQueries({ queryKey: ["all-videos"] });
    // },
  });
};

export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, url }: UploadParams) => {
      const fileUrl = await uploadToS3({ file, url });
      return fileUrl;
    },
  });
};

export const useVideoUploadComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => videoUploadComplete(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });
};
