import { AuthProvider } from "@/contexts/AuthContext";
import { AppRouter } from "@/app/router";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton duration={4000} />
    </AuthProvider>
  );
}
