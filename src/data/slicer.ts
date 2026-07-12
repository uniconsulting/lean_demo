export type SlicerTab = "model" | "gcode" | "artifacts";
export type SliceState = "request" | "running" | "ready";

export const pipelineSteps = [
  { id: "input", label: "Модель", detail: "3MF прочитан" },
  { id: "slice", label: "Orca CLI", detail: "профиль v1.4" },
  { id: "post", label: "Постобработка", detail: "4 макроса" },
  { id: "validate", label: "Проверка", detail: "контракт соблюдён" },
  { id: "artifact", label: "Артефакт", detail: "slice 74e1" },
] as const;

export const requiredMacros = ["FIRST_LAYER_CHECKPOINT", "COOLDOWN_EJECT", "WIPE", "PARK"] as const;

export const sliceQueue = [
  { id: "S-206", name: "Корпус датчика v7", profile: "K1C · PETG · PEI", progress: 64, status: "Слайсинг", tone: "running" },
  { id: "S-207", name: "Заглушка корпуса", profile: "Профиль не выбран", progress: 0, status: "Заблокировано", tone: "blocked" },
] as const;
