import  axiosInstance  from "../axiosInstance";
import { VideoItem } from "../../lib/types/video";

export const VideoService = {
  async getAllVideos(): Promise<VideoItem[]> {
    console.log("FETCHING ALL VIDEOS");
    const response = await axiosInstance.get("/api/all-videos");
    return response.data.videos; // returns array of videos
  },

  async getVideoAnalysis(videoId: string) {
    const response = await axiosInstance.get(`/api/videos/${videoId}/analysis`);
    return response.data;
  },
  async retryThumbnail(videoId: string) {
    const response = await axiosInstance.post(`/api/videos/${videoId}/retry-thumbnail`);
    return response.data;
  },
};