import type { User, LoginUser, AuthUser, UpdateUser } from "@/types";
import type { Socket } from "socket.io-client";

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  login: (user: LoginUser) => Promise<void>;
  updateProfile: (data: UpdateUser) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}
