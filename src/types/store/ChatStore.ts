import type { Message, SendMessage, User } from "@/types";

export interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoaading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessage) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}
