import  axiosInstance  from "../axiosInstance";

export const VideoService = {
  async getAllVideos() {
    console.log("FETCHING ALL VIDEOS");
    const response = await axiosInstance.get("/api/all-videos");
    return response.data.videos; // returns array of videos
  },

  async getVideoAnalysis(videoId: string) {
    const response = await axiosInstance.get(`/api/videos/${videoId}/analysis`);
    return response.data;
  },
};