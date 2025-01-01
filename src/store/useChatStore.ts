import { axiosInstance } from "@/lib/axios";
import { ChatState, ErrorResponse, Message, SendMessage, User } from "@/types";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

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

  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));
