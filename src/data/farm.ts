export type FarmFilter = "all" | "autonomous" | "blockers" | "control";

export type FarmPrinterState = "printing" | "finishing" | "waiting" | "ready";

export type FarmPrinter = {
  id: string;
  rack: "A" | "B" | "Control";
  mode: "autonomous" | "control";
  state: FarmPrinterState;
  progress?: number;
  material: string;
  job: string;
  fsm: string;
  cameraAt: string;
  reason?: string;
  source: string;
  nextAction: string;
  events: Array<{ time: string; message: string; tone: "success" | "warning" | "info" }>;
};

export const farmPrinters: FarmPrinter[] = [
  { id: "K1C-01", rack: "A", mode: "autonomous", state: "printing", progress: 78, material: "PLA · серый", job: "Корпус привода", fsm: "printing", cameraAt: "02:37:12", source: "Moonraker · edge", nextAction: "Дождаться завершения печати.", events: [{ time: "02:31", message: "Первый слой принят", tone: "success" }, { time: "01:58", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-02", rack: "A", mode: "autonomous", state: "printing", progress: 64, material: "PETG · чёрный", job: "Кожух датчика", fsm: "printing", cameraAt: "02:37:09", source: "Moonraker · edge", nextAction: "Действие оператора не требуется.", events: [{ time: "02:26", message: "Температура стабильна", tone: "success" }, { time: "01:41", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-03", rack: "A", mode: "autonomous", state: "printing", progress: 41, material: "ABS · белый", job: "Кронштейн", fsm: "printing", cameraAt: "02:37:05", source: "Moonraker · edge", nextAction: "Действие оператора не требуется.", events: [{ time: "02:18", message: "Камера доступна", tone: "success" }, { time: "00:54", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-04", rack: "A", mode: "autonomous", state: "waiting", material: "PLA · серый", job: "Втулка направляющей", fsm: "confirm_drop", cameraAt: "02:36:41", reason: "Тара годных заполнена на 92%", source: "весы · hardware", nextAction: "Освободить тару годных деталей и подтвердить продолжение.", events: [{ time: "02:36", message: "Тара заполнена · 92%", tone: "warning" }, { time: "02:35", message: "FSM → confirm_drop", tone: "warning" }, { time: "02:34", message: "Сброс детали подтверждён", tone: "success" }] },
  { id: "K1C-05", rack: "B", mode: "autonomous", state: "printing", progress: 88, material: "PLA · серый", job: "Корпус привода", fsm: "printing", cameraAt: "02:37:08", source: "Moonraker · edge", nextAction: "Дождаться завершения печати.", events: [{ time: "02:22", message: "Первый слой принят", tone: "success" }, { time: "01:15", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-06", rack: "B", mode: "autonomous", state: "printing", progress: 55, material: "PETG · чёрный", job: "Кожух датчика", fsm: "printing", cameraAt: "02:37:02", source: "Moonraker · edge", nextAction: "Действие оператора не требуется.", events: [{ time: "02:29", message: "Расход материала в норме", tone: "success" }, { time: "01:48", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-07", rack: "B", mode: "autonomous", state: "printing", progress: 22, material: "ABS · белый", job: "Кронштейн", fsm: "printing", cameraAt: "02:36:58", source: "Moonraker · edge", nextAction: "Действие оператора не требуется.", events: [{ time: "02:11", message: "Preflight пройден", tone: "success" }, { time: "02:09", message: "Печать запущена", tone: "info" }] },
  { id: "K1C-08", rack: "B", mode: "autonomous", state: "finishing", progress: 93, material: "PLA · серый", job: "Крышка корпуса", fsm: "cooling", cameraAt: "02:37:11", source: "Moonraker · edge", nextAction: "Охлаждение завершится через 4 минуты.", events: [{ time: "02:36", message: "FSM → cooling", tone: "info" }, { time: "01:12", message: "Печать запущена", tone: "info" }] },
  { id: "CTRL-01", rack: "Control", mode: "control", state: "ready", material: "PLA · чёрный", job: "Ручной учёт", fsm: "control_only", cameraAt: "02:36:52", source: "камера · оператор", nextAction: "Занятость отмечается оператором вручную.", events: [{ time: "02:12", message: "Камера синхронизирована", tone: "success" }, { time: "00:18", message: "Реле доступно", tone: "info" }] },
  { id: "CTRL-02", rack: "Control", mode: "control", state: "ready", material: "PETG · серый", job: "Ручной учёт", fsm: "control_only", cameraAt: "02:36:47", source: "камера · оператор", nextAction: "Занятость отмечается оператором вручную.", events: [{ time: "02:04", message: "Камера синхронизирована", tone: "success" }, { time: "00:22", message: "Реле доступно", tone: "info" }] },
];

export const farmTotals = [
  { value: "10", label: "Принтеров", detail: "8 автономных", tone: "success" },
  { value: "6", label: "Печатают", detail: "60% парка", tone: "success" },
  { value: "1", label: "Ожидает", detail: "нужен человек", tone: "warning" },
  { value: "1", label: "Завершает", detail: "охлаждение", tone: "info" },
  { value: "2", label: "Control-only", detail: "ручной учёт", tone: "neutral" },
] as const;
