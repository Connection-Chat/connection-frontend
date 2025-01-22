import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axios";

import type { AxiosError } from "axios";
import type {
  AuthState,
  AuthUser,
  ErrorResponse,
  LoginUser,
  UpdateUser,
} from "@/types";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
    : "/api";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");

      set({ authUser: response.data });

      get().connectSocket();
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

      get().connectSocket();
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

      get().connectSocket();
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

      get().disconnectSocket();
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

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
