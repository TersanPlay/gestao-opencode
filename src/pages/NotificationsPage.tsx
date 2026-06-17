import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/services/api";
import type { Notification } from "@/types";
import { CheckCheck, Bell, Eye } from "lucide-react";
import { toast } from "sonner";

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = () => { getNotifications().then(setNotifications).catch(() => {}); };
  useEffect(load, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: 1 } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
    toast.success("Todas marcadas como lidas");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeBadge = (type: string) => {
    const map: Record<string, { label: string; variant: "success" | "info" | "warning" | "default" }> = {
      visitor_checkin: { label: "Check-in", variant: "success" },
      visitor_scheduled: { label: "Agendado", variant: "info" },
      visitor_created: { label: "Novo", variant: "default" },
      user_created: { label: "Usuário", variant: "warning" },
    };
    const m = map[type] || { label: type, variant: "default" as const };
    return <Badge variant={m.variant}>{m.label}</Badge>;
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Notificações</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleMarkAllRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <EmptyState title="Nenhuma notificação" description="Você ainda não recebeu nenhuma notificação" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n.id} className={n.read ? "" : "bg-indigo-50/50"}>
                    <TableCell>{typeBadge(n.type)}</TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="text-muted-foreground">{n.message}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(n.createdAt).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {n.link && (
                          <Button variant="ghost" size="icon" onClick={() => navigate(n.link!)} title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {!n.read && (
                          <Button variant="ghost" size="icon" onClick={() => handleMarkRead(n.id)} title="Marcar como lida">
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}