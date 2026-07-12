export type IncidentStatus = "waiting" | "actioned" | "saved";
export type IncidentTone = "warning" | "danger" | "info";

export type Incident = {
  id: string;
  printer: string;
  product: string;
  material: string;
  progress: number;
  at: string;
  status: IncidentStatus;
  statusLabel: string;
  signal: string;
  confidence: string;
  verdict: string;
  reason: string;
  policy: string;
  tone: IncidentTone;
};

export const incidents: Incident[] = [
  {
    id: "INC-148", printer: "K1C-02", product: "Корпус датчика", material: "ABS", progress: 37, at: "14:18",
    status: "waiting", statusLabel: "ждёт человека", signal: "CV · blob", confidence: "0,72",
    verdict: "Эскалировать человеку, печать продолжить",
    reason: "Возможный дефект внешнего контура. Уверенности недостаточно для destructive outcome.",
    policy: "ABS / ASA: только алерт. Автоматическая пауза запрещена без согласованного safety-case.", tone: "warning",
  },
  {
    id: "INC-147", printer: "K1C-06", product: "Кронштейн-12", material: "PETG", progress: 6, at: "13:42",
    status: "actioned", statusLabel: "пауза подтверждена", signal: "first layer", confidence: "0,91",
    verdict: "Пауза подтверждена оператором",
    reason: "Отслоение первого слоя подтверждено человеком. Создано задание на перепечать.",
    policy: "PETG: пауза разрешена после human confirmation.", tone: "danger",
  },
  {
    id: "INC-146", printer: "K1C-03", product: "Заглушка корпуса", material: "PLA", progress: 81, at: "12:56",
    status: "saved", statusLabel: "false positive", signal: "CV · stringing", confidence: "0,64",
    verdict: "Вердикт опровергнут",
    reason: "Нить в кадре не повлияла на геометрию детали. Печать продолжена.",
    policy: "Исход сохранён как false positive для датасета.", tone: "info",
  },
];

export const incidentEvents = [
  { at: "14:18", source: "VLM", title: "Запрошено решение человека", detail: "continue · escalate_human" },
  { at: "14:17", source: "CV", title: "Обнаружен подозрительный контур", detail: "blob · confidence 0,72" },
  { at: "14:17", source: "RULE", title: "Политика ABS запретила auto-pause", detail: "детерминированное правило Edge" },
] as const;
