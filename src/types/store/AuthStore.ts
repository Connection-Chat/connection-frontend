import { User, SignUpUser, LoginUser } from "@/types";

export interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signup: (user: SignUpUser) => Promise<void>;
  logout: () => Promise<void>;
  login: (user: LoginUser) => Promise<void>;
}
