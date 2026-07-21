"use client";
import axiosInstance from "../axiosInstance";
import axios from "axios";

type PresignedRequest = {
  videoName: string;
  thumbnailName?: string;
};

export const getPresignedUrl = async ({
  videoName,
  thumbnailName,
}: PresignedRequest) => {
  const { data } = await axiosInstance.post(
    "/api/videos/generate-presigned-url",
    {
      videoName,
      thumbnailName,
    }
  );

  return data;
};

// Upload to S3 using presigned URL
export const uploadToS3 = async ({
  file,
  url,
}: {
  file: File;
  url: string;
}) => {
  console.log("Uploading to S3 with URL:", url);
  await axios.put(url, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  // return clean file URL (without query params)
  return url.split("?")[0];
};

// Confirm the upload succeeded so the backend promotes the doc from
// awaiting_upload -> pending_upload (otherwise it stays hidden and is GC'd).
export const confirmUpload = async (videoId: string) => {
  const { data } = await axiosInstance.post(
    `/api/videos/${videoId}/confirm-upload`,
  );
  return data;
};

