import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axios";

import type { AxiosError } from "axios";
import type { AuthState, AuthUser, ErrorResponse, LoginUser, UpdateUser } from "@/types";

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");

      set({ authUser: response.data });
    } catch (error) {
      console.log("Error checking auth: ", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: AuthUser) => {
    set({ isSigningUp: true });

    try {
      const response = await axiosInstance.post("/auth/signup", data);

      set({ authUser: response.data });

      toast.success("Account created successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginUser) => {
    set({ isLoggingIn: true });

    try {
      const response = await axiosInstance.post("/auth/login", data);

      set({ authUser: response.data });

      toast.success("Logged in successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });

      toast.success("Logged out successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  },

  updateProfile: async (data: UpdateUser) => {
    set({ isUpdatingProfile: true });

    try {
      const response = await axiosInstance.put("/auth/update-profile", data);

      set({ authUser: response.data });

      toast.success("Profile updated successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
