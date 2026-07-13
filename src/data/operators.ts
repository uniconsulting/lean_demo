export type OperatorRole = "operator" | "admin" | "support";
export type OperatorStatus = "active" | "invited" | "disabled";

export type Operator = {
  id: string;
  name: string;
  initials: string;
  role: OperatorRole;
  status: OperatorStatus;
  completedSteps: number;
  wireguard?: boolean;
  lastSeen: string;
};

export const operators: Operator[] = [
  { id: "anna", name: "Анна Орлова", initials: "АО", role: "operator", status: "active", completedSteps: 6, lastSeen: "сейчас · смена B" },
  { id: "max", name: "Максим Серов", initials: "МС", role: "operator", status: "active", completedSteps: 4, lastSeen: "14:28 · цех" },
  { id: "alex", name: "Алексей Данилов", initials: "АД", role: "admin", status: "active", completedSteps: 6, lastSeen: "12:04 · удалённо" },
  { id: "support", name: "ЛЁН Support", initials: "ЛС", role: "support", status: "active", completedSteps: 6, wireguard: true, lastSeen: "09:16 · WireGuard" },
];

export const onboardingSteps = [
  { id: "morning", title: "Разобрать ночь", detail: "сводка → задачи → журнал", domain: "Утро" },
  { id: "series", title: "Поставить серию", detail: "изделие → очередь", domain: "День" },
  { id: "spool", title: "Заменить катушку", detail: "весы → остаток → разблокировка", domain: "Материал" },
  { id: "incident", title: "Разобрать инцидент", detail: "VLM → политика → human outcome", domain: "Качество" },
  { id: "night", title: "Зарядить ночь", detail: "preflight → approve night", domain: "Ночь" },
  { id: "destructive", title: "Деструктивные команды", detail: "последствия → подтверждение → аудит", domain: "Safety" },
];

export const rolePermissions = [
  { domain: "Очередь и задачи", operator: "работа", admin: "управление", support: "просмотр" },
  { domain: "Инциденты", operator: "human outcome", admin: "корректировка", support: "диагностика" },
  { domain: "Отчёт смены", operator: "просмотр", admin: "закрытие", support: "аудит" },
  { domain: "Пользователи", operator: "—", admin: "управление", support: "—" },
  { domain: "Edge и fault", operator: "статус", admin: "статус", support: "WireGuard" },
];
