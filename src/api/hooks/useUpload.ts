"use client";
import { useMutation } from "@tanstack/react-query";
import { getPresignedUrl,uploadToS3 } from "../endpoints/upload";


interface UploadParams {
  file: File;
  url: string;
}

export const usePresignedUrl = () => {
  return useMutation({
    mutationFn: getPresignedUrl,
  });
};

export const useUploadVideo = () => {
  return useMutation({
    mutationFn: async ({ file, url }: UploadParams) => {
      const fileUrl = await uploadToS3({ file, url });
      return fileUrl;
    },
  });
};