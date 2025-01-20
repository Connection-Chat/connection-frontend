import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "@/lib/axios";

import type { AxiosError } from "axios";
import type { ChatState, ErrorResponse, SendMessage, User } from "@/types";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoaading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoaading: true });

    try {
      const response = await axiosInstance.get("/messages/users");

      set({ users: response.data });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isUsersLoaading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });

    try {
      const response = await axiosInstance.get(`/messages/${userId}`);

      set({ messages: response.data });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: SendMessage) => {
    const { selectedUser, messages } = get();

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );

      set({ messages: [...messages, response.data] });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId !== selectedUser._id;

      if (isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket?.off("newMessage");
  },

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));
