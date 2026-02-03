import  axiosInstance  from "../axiosInstance";

export const VideoService = {
  async getAllVideos() {
    const response = await axiosInstance.get("/api/all-videos");
    return response.data.videos; // returns array of videos
  }
};