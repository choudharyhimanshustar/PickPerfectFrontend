"use client";
import React from "react";
import { usePresignedUrl, useUploadVideo } from "@/api/hooks/useUpload";
const MyForm: React.FC = () => {
  const { mutateAsync: getUrl, isPending } = usePresignedUrl();
  const uploadMutation = useUploadVideo();
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("type of file.name:", typeof file.name);
    const { url } = await getUrl(file.name);
    console.log("Presigned URL:", url);
    await uploadMutation.mutateAsync({ file, url });
    // ✅ Proper JSX return
  };
  return (
    <div className="p-4">
      <input type="file" accept="video/*" onChange={handleFile} />
      {isPending && <p>Generating URL...</p>}
      {uploadMutation.isPending && <p>Uploading...</p>}
      {uploadMutation.isSuccess && (
        <video
          src={uploadMutation.data}
          controls
          className="mt-4 w-full rounded-lg border"
        />
      )}
    </div>
  );
};

export default MyForm;
