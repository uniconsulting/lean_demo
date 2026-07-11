export type SemanticTone = "success" | "info" | "warning" | "danger" | "neutral";

export type PrinterState = "printing" | "finishing" | "waiting" | "fault";

export type PrinterView = {
  id: string;
  rack: string;
  state: PrinterState;
  detail: string;
};

export type ShiftEvent = {
  time: string;
  object: string;
  message: string;
  tone: SemanticTone;
};
