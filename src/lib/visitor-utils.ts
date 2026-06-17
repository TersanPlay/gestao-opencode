import { CheckCircle, XCircle, Send } from "lucide-react";
import type { Visitor } from "@/types";

export const STATUS_ACTIONS: { status: Visitor["status"]; label: string; icon: typeof Send; nextStatus: Visitor["status"] }[] = [
  { status: "scheduled", label: "Registrar Check-in", icon: Send, nextStatus: "checking_in" },
  { status: "checking_in", label: "Iniciar Visita", icon: Send, nextStatus: "in_progress" },
  { status: "in_progress", label: "Finalizar Visita", icon: CheckCircle, nextStatus: "completed" },
  { status: "completed", label: "", icon: CheckCircle, nextStatus: "completed" },
  { status: "cancelled", label: "", icon: XCircle, nextStatus: "cancelled" },
];
