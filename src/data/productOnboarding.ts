import type { LucideIcon } from "lucide-react";
import { BadgeCheck, FileBox, FileCode2, FlaskConical, Image, SlidersHorizontal } from "lucide-react";

export type OnboardingPhase = "slice" | "calibration" | "references" | "approved";

export type OnboardingStep = {
  id: OnboardingPhase | "model" | "profile";
  label: string;
  icon: LucideIcon;
};

export const onboardingSteps: OnboardingStep[] = [
  { id: "model", label: "Модель", icon: FileBox },
  { id: "profile", label: "Профиль", icon: SlidersHorizontal },
  { id: "slice", label: "Слайсинг", icon: FileCode2 },
  { id: "calibration", label: "Калибровка", icon: FlaskConical },
  { id: "references", label: "Эталоны", icon: Image },
  { id: "approved", label: "Допуск", icon: BadgeCheck },
];

export const calibrationJobs = [
  { id: "P-042-C01", printer: "K1C-02", status: "первый слой", result: "эталон получен" },
  { id: "P-042-C02", printer: "K1C-05", status: "в очереди", result: "ожидает" },
  { id: "P-042-C03", printer: "K1C-07", status: "в очереди", result: "ожидает" },
] as const;

export const sliceMetrics = [
  { label: "Время", value: "2:14", note: "на деталь", tone: "base" },
  { label: "Материал", value: "96 г", note: "расчёт Orca", tone: "base" },
  { label: "Post-processing", value: "3", note: "обязательных макроса", tone: "signal" },
  { label: "Артефакт", value: "74e1", note: "версия G-code", tone: "base" },
] as const;

export const gateChecks = [
  { title: "Файл валиден", detail: "3MF прочитан" },
  { title: "Профиль найден", detail: "совместим с материалом" },
  { title: "Макросы вставлены", detail: "post-processing проверен" },
] as const;
