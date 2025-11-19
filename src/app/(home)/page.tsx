"use client";
import React, { useState,useEffect } from "react";
import { Banner } from "@/components/Banner";
import { useAllVideos } from "@/api/hooks/getVideos";
import { FaPlay } from "react-icons/fa6";

export default function Home() {
  const { data, isLoading, isError } = useAllVideos();
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
  const handleEsc = (e:KeyboardEvent) => {
    if (e.key === "Escape") {
      handleVideoPlay({ open: false, url: "" });
    }
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);
  const handleVideoPlay=({ open, url }: { open: boolean; url: string }) => {
    setVideoUrl(url);
    setIsOpen(open);
  };
  return (
    <div className="font-sans items-center min-h-screen p-4 space-y-6">
      <Banner />
      <div className="flex flex-row space-x-4">
        {data?.map((video: any) => (
          <div>
            <div
              key={video.key}
              className="flex flex-col bg-[#E3E4DF] rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 w-fit"
            >
              <video
                src={video.url}
                className="rounded-lg w-[25rem] aspect-video bg-black"
              />
              <button
                onClick={() => handleVideoPlay({open:true, url:video.url})}
                className="relative -top-[8rem] right-[-40%] w-fit cursor-pointer"
              >
                <FaPlay className="text-red-500 text-6xl opacity-75 hover:opacity-100" />
              </button>
              <span className="text-sm mt-3 font-medium text-gray-700 truncate w-fit">
                {video.key}
              </span>
            </div>
            {isOpen && (
              <div
                className="fixed inset-0 bg-white w-[99%] h-screen p-4 bg-opacity-75 flex items-center justify-center z-50 rounded-lg mx-auto"
                onClick={() => handleVideoPlay({open:false, url:""})}
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
        ))}
      </div>
    </div>
  );
}
