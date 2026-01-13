import axiosInstance from "../axiosInstance";

export const AuthService = {
  signup(data: { email: string; password: string }) {
    return axiosInstance.post("/auth/signup", data);
  },

  login(data: { email: string; password: string }) {
    return axiosInstance.post("/auth/login", data);
  },

  me() {
    return axiosInstance.get("/auth/me");
  },
};