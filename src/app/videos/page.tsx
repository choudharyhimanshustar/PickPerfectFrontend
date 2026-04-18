"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/ui/AuthCard";
import { useMe } from "@/api/hooks/useAuth";
import { useAllVideos,useThumbnailSSE} from "@/api/hooks/getVideos";
import { FaPlay } from "react-icons/fa6";

export default function Home() {
  const { data: rawData, isLoading, isError } = useAllVideos();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const { data: meData, isLoading: meIsLoading } = useMe();

  // Local copy so we can patch thumbnails in-place without refetching
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (rawData) setVideos(rawData);
  }, [rawData]);

  useEffect(() => {
    if (!meIsLoading && !meData?.authenticated) setShowAuth(true);
    else setShowAuth(false);
  }, [meData, meIsLoading]);

  // Patch a single video's thumbnail when the SSE event arrives
  const handleThumbnailReady = (videoId: string, thumbnailUrl: string) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.video_id === videoId ? { ...v, thumbnail_url: thumbnailUrl } : v
      )
    );
  };

  useThumbnailSSE(videos, handleThumbnailReady);

  return (
    <div className="font-sans min-h-screen p-4 space-y-6 w-full">
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <AuthCard />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {videos.map((video: any) => (
          <div
            key={video.video_id}
            onClick={() => router.push(`/videos/${video.video_id}`)}
            className="flex flex-col bg-[#E3E4DF] rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 w-full cursor-pointer"
          >
            <div className="relative w-full">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.filename}
                  className="rounded-lg w-full aspect-video object-cover bg-black"
                />
              ) : (
                // Skeleton shown while thumbnail is still processing
                <div className="rounded-lg w-full aspect-video bg-gray-300 animate-pulse" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <FaPlay className="text-red-500 text-4xl opacity-80" />
              </div>
            </div>
            <span className="text-sm mt-3 font-medium text-gray-700 truncate w-full">
              {video.filename}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}