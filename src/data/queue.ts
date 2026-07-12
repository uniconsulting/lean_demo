export type QueueTone = "running" | "next" | "blocked";

export type QueueJob = {
  id: string;
  position: number;
  product: string;
  version: string;
  quantity: number;
  material: string;
  duration: string;
  durationNote: string;
  assignment: string;
  assignmentNote: string;
  profile: string;
  artifact: string;
  nightAllowed: boolean;
  compatible: string[];
  tone: QueueTone;
  state: string;
};

export const initialQueueJobs: QueueJob[] = [
  { id: "041", position: 1, product: "Корпус датчика", version: "v5", quantity: 24, material: "PETG · чёрный", duration: "5 ч 10 мин", durationNote: "остаток серии", assignment: "K1C-01 · K1C-02", assignmentNote: "назначено диспетчером", profile: "K1C · PETG · PEI", artifact: "slice 8a1f", nightAllowed: true, compatible: ["K1C-01", "K1C-02"], tone: "running", state: "печать" },
  { id: "024", position: 2, product: "Кронштейн-12", version: "v3", quantity: 40, material: "PLA · серый", duration: "6 ч 25 мин", durationNote: "расчётное время", assignment: "3 принтера", assignmentNote: "K1C-03 / 05 / 07", profile: "K1C · PLA · PEI", artifact: "slice 74d2", nightAllowed: true, compatible: ["K1C-03", "K1C-05", "K1C-07"], tone: "next", state: "следующее" },
  { id: "031", position: 3, product: "Заглушка корпуса", version: "v2", quantity: 50, material: "PLA · белый", duration: "4 ч 40 мин", durationNote: "расчётное время", assignment: "2 принтера", assignmentNote: "совместимы", profile: "K1C · PLA · PEI", artifact: "slice 4bd9", nightAllowed: true, compatible: ["K1C-05", "K1C-08"], tone: "next", state: "следующее" },
  { id: "057", position: 4, product: "Кожух вентилятора", version: "v4", quantity: 16, material: "PETG · недостаточно остатка", duration: "3 ч 20 мин", durationNote: "добавит к ночи", assignment: "Катушка #17", assignmentNote: "K1C-06 · 180 г", profile: "K1C · PETG · PEI", artifact: "slice c201", nightAllowed: true, compatible: ["K1C-06"], tone: "blocked", state: "блокер" },
];

export const dispatchFactors = [
  { label: "Совместимость", value: "3 свободных K1C" },
  { label: "Ночной допуск", value: "Все следующие допущены" },
  { label: "Дедлайн", value: "#024 раньше #031" },
] as const;
