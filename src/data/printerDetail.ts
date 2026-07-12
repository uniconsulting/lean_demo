export type PrinterFsmStage = "idle" | "preflight" | "heating" | "printing" | "cooling" | "ejecting" | "sorting" | "confirm_drop";

export type PrinterDetail = {
  id: string;
  rack: string;
  mode: string;
  stage: PrinterFsmStage;
  cameraAt: string;
  headline: string;
  description: string;
  telemetry: Array<{ label: string; value: string; unit?: string; detail: string; tone: "stable" | "info" | "warning" }>;
  job: { name: string; material: string; series: string; artifact: string };
  spool: { material: string; id: string; remaining: string; batch: string };
  surface: { name: string; cycles: string; note: string };
  sync: { state: string; detail: string; tone: "stable" | "warning" };
  events: Array<{ time: string; message: string; tone: "stable" | "info" | "warning" }>;
};

export const fsmStages: Array<{ id: PrinterFsmStage; label: string }> = [
  { id: "idle", label: "idle" },
  { id: "preflight", label: "preflight" },
  { id: "heating", label: "нагрев" },
  { id: "printing", label: "печать" },
  { id: "cooling", label: "охлаждение" },
  { id: "ejecting", label: "сброс" },
  { id: "sorting", label: "сортировка" },
  { id: "confirm_drop", label: "подтверждение" },
];

export const printerDetails: PrinterDetail[] = [
  {
    id: "K1C-04",
    rack: "Стойка A",
    mode: "автономный",
    stage: "confirm_drop",
    cameraAt: "02:36:41",
    headline: "Ожидает подтверждения сброса",
    description: "Печать завершена. Тара годных заполнена на 92%, поэтому Edge безопасно удерживает следующий цикл.",
    telemetry: [
      { label: "Сопло", value: "35°", detail: "охлаждение", tone: "stable" },
      { label: "Стол", value: "31°", detail: "охлаждение", tone: "stable" },
      { label: "Прогресс", value: "100", unit: "%", detail: "job #041", tone: "info" },
      { label: "ETA цикла", value: "—", detail: "ожидает человека", tone: "warning" },
    ],
    job: { name: "Втулка направляющей", material: "PLA · серый", series: "Серия 24 шт.", artifact: "slice 74d2" },
    spool: { material: "PLA · серый", id: "Катушка #17", remaining: "610 г", batch: "партия 2406" },
    surface: { name: "PEI", cycles: "41 цикл", note: "Клей: оценка после Э1 🔬" },
    sync: { state: "Edge автономен", detail: "center sync · 4 мин назад", tone: "stable" },
    events: [
      { time: "02:36:41", message: "Тара заполнена · весы · hardware", tone: "warning" },
      { time: "02:35:58", message: "FSM → confirm_drop", tone: "warning" },
      { time: "02:34:12", message: "Сброс детали подтверждён", tone: "stable" },
      { time: "02:33:48", message: "Печать завершена · 412/412 слоёв", tone: "info" },
    ],
  },
];

export function getPrinterDetail(id: string | undefined) {
  return printerDetails.find((printer) => printer.id === id) ?? printerDetails[0];
}
