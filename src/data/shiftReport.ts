export type HourlyOutput = { hour: string; passed: number; rejected: number; utilization: number };
export type ReportEvent = { time: string; title: string; detail: string; tone: "info" | "warning" | "danger" | "success"; source: string };

export const hourlyOutput: HourlyOutput[] = [
  { hour: "22", passed: 3, rejected: 0, utilization: 72 },
  { hour: "23", passed: 4, rejected: 0, utilization: 86 },
  { hour: "00", passed: 5, rejected: 0, utilization: 91 },
  { hour: "01", passed: 4, rejected: 1, utilization: 88 },
  { hour: "02", passed: 4, rejected: 0, utilization: 82 },
  { hour: "03", passed: 3, rejected: 0, utilization: 76 },
  { hour: "04", passed: 2, rejected: 0, utilization: 68 },
  { hour: "05", passed: 1, rejected: 0, utilization: 55 },
];

export const reportEvents: ReportEvent[] = [
  { time: "02:22", title: "INC-148 · спорный контур", detail: "K1C-02 · нужен human outcome", tone: "danger", source: "Инцидент" },
  { time: "03:41", title: "Тара A-12 заполнена", detail: "TASK-184 · освобождена в 03:48", tone: "warning", source: "Задача" },
  { time: "04:16", title: "Калибровка P-041", detail: "эталон принят оператором", tone: "info", source: "Изделие" },
  { time: "05:57", title: "Последняя деталь в таре", detail: "PT-000275 · trace сохранён", tone: "success", source: "Журнал" },
];

export const reportKpis = [
  { label: "Ложные остановки", value: "0", note: "цель ≤ 1 на 50 печатей", tone: "success" },
  { label: "Пропуск катастроф", value: "0", note: "сверка видеоархива", tone: "success" },
  { label: "Задачи через систему", value: "100%", note: "5 из 5 действий", tone: "info" },
  { label: "Трассируемость", value: "26 / 27", note: "один исход уточняется", tone: "warning" },
] as const;
