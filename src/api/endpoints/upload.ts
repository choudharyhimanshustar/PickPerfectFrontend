"use client";
import  axiosInstance  from "../axiosInstance";
import axios from "axios";
export const getPresignedUrl = async (fileName: string) => {
  const { data } = await axiosInstance.get("/generate-presigned-url", {
    params: { filename: fileName },
  });
  console.log("Presigned URL response data:", data);
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
  await axios.put(url, file, {
    headers: {
      "Content-Type": "video/mp4",
    }
  });

  // return clean file URL (without query params)
  return url.split("?")[0];
};