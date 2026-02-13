"use client";
import React, { useState, useEffect } from "react";
import AuthCard from "@/components/ui/AuthCard";
import { useMe } from "@/api/hooks/useAuth";
import { useAllVideos } from "@/api/hooks/getVideos";
import { FaPlay } from "react-icons/fa6";

export default function Home() {
  const { data, isLoading, isError } = useAllVideos();
  console.log("VIDEOS LIST RENDERED", data);
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const { data: meData, isLoading: meIsLoading } = useMe();

  useEffect(() => {
    if (!meIsLoading && !meData?.authenticated) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
    }
  }, [meData, meIsLoading]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleVideoPlay({ open: false, url: "" });
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  const handleVideoPlay = ({ open, url }: { open: boolean; url: string }) => {
    setVideoUrl(url);
    setIsOpen(open);
  };
  return (
    <div className="font-sans min-h-screen p-4 space-y-6 w-full">
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <AuthCard />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {data?.map((video: any) => (
          <div
            key={video.video_id}
            className="flex flex-col bg-[#E3E4DF] rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 w-full"
          >
            <div className="relative w-full">
              <video
                src={video.url}
                className="rounded-lg w-full aspect-video bg-black"
              />
              <button
                type="button"
                onClick={() => handleVideoPlay({ open: true, url: video.url })}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                <FaPlay className="text-red-500 text-4xl opacity-75 hover:opacity-100" />
              </button>
            </div>
            <span className="text-sm mt-3 font-medium text-gray-700 truncate w-full">
              {video.filename}
            </span>
          </div>
        ))}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white w-[99%] h-screen p-4 bg-opacity-75 flex items-center justify-center z-50 rounded-lg mx-auto"
          onClick={() => handleVideoPlay({ open: false, url: "" })}
        >
          <video
            src={videoUrl}
            className="rounded-lg w-[80%] h-[80%] bg-black"
            controls
            autoPlay
          />
        </div>
      )}
    </div>
  );
}
