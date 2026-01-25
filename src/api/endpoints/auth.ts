import axiosInstance from "../axiosInstance";

export const AuthService = {
  signup(data: { email: string; password: string }) {
    return axiosInstance.post("/api/auth/signup", data);
  },

  login(data: { email: string; password: string }) {
    return axiosInstance.post("/api/auth/login", data);
  },

  async me() {
    const res = await axiosInstance.get("/api/auth/me");
    return res.data;
  },
  
  logout() {
    return axiosInstance.post("/api/auth/logout");
  },
};
