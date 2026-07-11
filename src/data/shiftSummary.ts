import type { PrinterView, ShiftEvent } from "./types";

export const printers: PrinterView[] = [
  { id: "A1", rack: "A", state: "printing", detail: "64% · Корпус" },
  { id: "A2", rack: "A", state: "printing", detail: "31% · Кожух" },
  { id: "A3", rack: "A", state: "printing", detail: "48% · Кронштейн" },
  { id: "A4", rack: "A", state: "waiting", detail: "ждёт тару" },
  { id: "A5", rack: "A", state: "printing", detail: "82% · Корпус" },
  { id: "A6", rack: "A", state: "finishing", detail: "2 мин" },
  { id: "B1", rack: "B", state: "printing", detail: "87% · Втулка" },
  { id: "B2", rack: "B", state: "printing", detail: "49% · Кожух" },
  { id: "B3", rack: "B", state: "printing", detail: "22% · Корпус" },
  { id: "B4", rack: "B", state: "finishing", detail: "5 мин" },
  { id: "B5", rack: "B", state: "printing", detail: "71% · Втулка" },
  { id: "B6", rack: "B", state: "printing", detail: "15% · Крышка" },
  { id: "C1", rack: "C", state: "printing", detail: "53% · Корпус" },
  { id: "C2", rack: "C", state: "waiting", detail: "материал" },
  { id: "C3", rack: "C", state: "printing", detail: "67% · Крышка" },
  { id: "C4", rack: "C", state: "printing", detail: "39% · Кожух" },
  { id: "C5", rack: "C", state: "finishing", detail: "7 мин" },
  { id: "C6", rack: "C", state: "printing", detail: "91% · Втулка" },
  { id: "D1", rack: "D", state: "printing", detail: "44% · Корпус" },
  { id: "D2", rack: "D", state: "printing", detail: "58% · Кронштейн" },
  { id: "D3", rack: "D", state: "fault", detail: "экструзия" },
  { id: "D4", rack: "D", state: "printing", detail: "76% · Крышка" },
  { id: "D5", rack: "D", state: "printing", detail: "33% · Корпус" },
  { id: "D6", rack: "D", state: "finishing", detail: "4 мин" },
  { id: "E1", rack: "E", state: "printing", detail: "61% · Втулка" },
  { id: "E2", rack: "E", state: "waiting", detail: "preflight" },
  { id: "E3", rack: "E", state: "printing", detail: "28% · Корпус" },
  { id: "E4", rack: "E", state: "printing", detail: "73% · Кожух" },
];

export const shiftEvents: ShiftEvent[] = [
  { time: "02:22", object: "D3 · Стеллаж D", message: "Сбой экструзии · создан инцидент", tone: "danger" },
  { time: "02:14", object: "A4 · Стеллаж A", message: "Тара достигла 92% · создана задача", tone: "warning" },
  { time: "02:05", object: "B3 · Стеллаж B", message: "Задание завершено · 12 деталей", tone: "success" },
  { time: "01:58", object: "C3 · Стеллаж C", message: "Напоминание по обслуживанию", tone: "info" },
];

export const stateTotals = [
  { value: "22", label: "Работают", tone: "success" },
  { value: "4", label: "Завершение", tone: "info" },
  { value: "3", label: "Ожидают", tone: "warning" },
  { value: "1", label: "Ошибка", tone: "danger" },
] as const;
