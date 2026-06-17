import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout() {
  return (
    <div className="flex min-h-[100dvh] bg-[#f8fafc]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-6 pb-8 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
