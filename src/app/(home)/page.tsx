"use client";
import { Banner } from "@/components/Banner";
import { useAllVideos } from "@/api/hooks/getVideos";
export default function Home() {
  const { data, isLoading, isError } = useAllVideos();
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-4 space-y-6">
      <Banner />
      <div className="flex flex-row space-x-4">
        {data?.map((video: any) => (
          <div
            key={video.key}
            className="flex flex-col bg-[#E3E4DF] rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200 w-fit"
          >
            <video
              controls
              src={video.url}
              className="rounded-lg w-[25rem] aspect-video bg-black"
            />
            <span className="text-sm mt-3 font-medium text-gray-700 truncate w-fit">
              {video.key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
