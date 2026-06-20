import { AuthProvider } from "@/contexts/AuthContext";
import { AppRouter } from "@/app/router";
import { Toaster } from "sonner";

const TOAST_DURATION_MS = 4000;

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton duration={TOAST_DURATION_MS} />
    </AuthProvider>
  );
}
