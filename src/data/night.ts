export type NightCheckId = "queue" | "filament" | "bin" | "preflight" | "fire" | "edge" | "center";

export type NightPrinter = {
  id: string;
  part: string;
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
  { id: "K1C-01", part: "Корпус датчика" },
  { id: "K1C-02", part: "Корпус датчика" },
  { id: "K1C-03", part: "Кронштейн-12" },
  { id: "K1C-04", part: "preflight 6/7", blocker: "bin" },
  { id: "K1C-05", part: "Кронштейн-12" },
  { id: "K1C-06", part: "катушка #17", blocker: "filament" },
  { id: "K1C-07", part: "Заглушка" },
  { id: "K1C-08", part: "Заглушка" },
];

export const nightPolicy = [
  { label: "Будит оператора", value: "Пожарная цепь или VLM требует cancel" },
  { label: "Пропускает", value: "Неуверенный preflight без безопасного старта" },
  { label: "Offline", value: "Edge допечатает зеркальную очередь" },
] as const;
