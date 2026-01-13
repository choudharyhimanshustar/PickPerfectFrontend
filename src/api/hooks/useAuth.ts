// src/hooks/useAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "../endpoints/auth";

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
  return useQuery({
    queryKey: ["me"],
    queryFn: AuthService.me,
  });
};
