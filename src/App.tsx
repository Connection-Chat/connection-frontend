import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { Navbar } from "@/components";
import {
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  SignUpPage,
} from "@/pages";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/enums";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path={ROUTES.HOME}
          element={authUser ? <HomePage /> : <Navigate to={ROUTES.LOGIN} />}
        />
        <Route
          path={ROUTES.SIGNUP}
          element={!authUser ? <SignUpPage /> : <Navigate to={ROUTES.HOME} />}
        />
        <Route
          path={ROUTES.LOGIN}
          element={!authUser ? <LoginPage /> : <Navigate to={ROUTES.HOME} />}
        />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        <Route
          path={ROUTES.PROFILE}
          element={authUser ? <ProfilePage /> : <Navigate to={ROUTES.LOGIN} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
