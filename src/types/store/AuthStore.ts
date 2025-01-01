import type { User, LoginUser, AuthUser, UpdateUser } from "@/types";

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];

  checkAuth: () => Promise<void>;
  signup: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  login: (user: LoginUser) => Promise<void>;
  updateProfile: (data: UpdateUser) => Promise<void>;
}
