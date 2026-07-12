export type NightCheckId = "queue" | "filament" | "bin" | "preflight" | "fire" | "edge" | "center";

export type NightPrinter = {
  id: string;
  job: string;
  material: string;
  fsm: string;
  blocker?: "bin" | "filament";
};

export const nightChecks = [
  { id: "queue", label: "Очередь", detail: "18 ч 40 мин" },
  { id: "filament", label: "Филамент", detail: "катушка #17" },
  { id: "bin", label: "Тара", detail: "стойка A" },
  { id: "preflight", label: "Preflight", detail: "7 из 8" },
  { id: "fire", label: "Пожар", detail: "цепь OK" },
  { id: "edge", label: "Edge", detail: "зеркало свежее" },
  { id: "center", label: "Центр", detail: "online" },
] satisfies Array<{ id: NightCheckId; label: string; detail: string }>;

export const nightPrinters: NightPrinter[] = [
  { id: "K1C-01", job: "Корпус датчика", material: "PLA · серый", fsm: "night_ready" },
  { id: "K1C-02", job: "Корпус датчика", material: "PETG · чёрный", fsm: "night_ready" },
  { id: "K1C-03", job: "Кронштейн-12", material: "PLA · серый", fsm: "night_ready" },
  { id: "K1C-04", job: "Втулка направляющей", material: "PLA · серый", fsm: "confirm_drop", blocker: "bin" },
  { id: "K1C-05", job: "Кронштейн-12", material: "PLA · серый", fsm: "night_ready" },
  { id: "K1C-06", job: "Кожух датчика", material: "PETG · чёрный", fsm: "spool_check", blocker: "filament" },
  { id: "K1C-07", job: "Заглушка", material: "ABS · белый", fsm: "night_ready" },
  { id: "K1C-08", job: "Заглушка", material: "PLA · серый", fsm: "night_ready" },
];

export const nightPolicy = [
  { label: "Будит оператора", value: "Пожарная цепь или VLM требует cancel" },
  { label: "Пропускает", value: "Неуверенный preflight без безопасного старта" },
  { label: "Offline", value: "Edge допечатает зеркальную очередь" },
] as const;
