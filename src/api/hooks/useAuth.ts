// src/hooks/useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "../endpoints/auth";

export interface MeResponse {
  authenticated: boolean;
  user_id: string | null;
  email: string | null;
}



export const useSignup = () => {
  return useMutation({
    mutationFn: AuthService.signup,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: AuthService.login,
  });
};

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: AuthService.me,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: AuthService.logout,
  });
};
