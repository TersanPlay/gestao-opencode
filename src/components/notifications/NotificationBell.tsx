import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Eye } from "lucide-react";
import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from "@/services/api";
import type { Notification } from "@/types";

const POLL_INTERVAL_MS = 30000;

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function load() {
      getUnreadCount().then((r) => setUnread(r.count)).catch((err) => console.error(err));
      getNotifications(true).then(setNotifications).catch((err) => console.error(err));
    }
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: 1 } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications([]);
    setUnread(0);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
        aria-label="Notificações"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-popover text-popover-foreground shadow-lg z-50">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold">Notificações</span>
            <div className="flex gap-2">
              {unread > 0 && (
                <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800" title="Marcar todas como lidas">
                  <CheckCheck className="h-3 w-3" /> Todas
                </button>
              )}
              <button onClick={() => { setOpen(false); navigate("/notifications"); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground" title="Ver todas">
                <Eye className="h-3 w-3" /> Ver todas
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma notificação</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 border-b px-4 py-3 text-sm transition-colors hover:bg-accent cursor-pointer ${n.read ? "" : "bg-indigo-50/50"}`}
                  onClick={() => { handleMarkRead(n.id); if (n.link) { setOpen(false); navigate(n.link); } }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
