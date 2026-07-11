import {
  BarChart3,
  Boxes,
  Factory,
  LayoutDashboard,
  ListOrdered,
  Printer,
  ScrollText,
  Settings,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

export const navigationItems: NavigationItem[] = [
  { label: "Сводка смены", path: "/", icon: LayoutDashboard, match: (path) => path === "/" || path === "/night" },
  { label: "Ферма", path: "/farm", icon: Factory, match: (path) => path === "/farm" },
  { label: "Принтеры", path: "/printers/K1C-04", icon: Printer, match: (path) => path.startsWith("/printers/") },
  { label: "Очередь", path: "/queue", icon: ListOrdered, match: (path) => path === "/queue" },
  { label: "Изделия", path: "/products", icon: Boxes, match: (path) => path.startsWith("/products") },
  { label: "Качество", path: "/incidents", icon: ShieldCheck, match: (path) => path === "/incidents" },
  { label: "Обслуживание", path: "/tasks", icon: Wrench, match: (path) => path === "/tasks" },
  { label: "События", path: "/parts", icon: ScrollText, match: (path) => path === "/parts" },
  { label: "Аналитика", path: "/reports/shift", icon: BarChart3, match: (path) => path.startsWith("/reports") },
  { label: "Настройки", path: "/settings/operators", icon: Settings, match: (path) => path.startsWith("/settings") },
];

export type RouteMeta = {
  title: string;
  context: string;
};

export const routeMeta: Record<string, RouteMeta> = {
  "/": { title: "Сводка смены", context: "Командный центр" },
  "/farm": { title: "Ферма", context: "Стойки и принтеры" },
  "/queue": { title: "Очередь", context: "Серии и покрытие" },
  "/night": { title: "Зарядить ночь", context: "Протокол готовности" },
  "/products": { title: "Изделия", context: "Производственная библиотека" },
  "/products/new": { title: "Новое изделие", context: "Onboarding" },
  "/incidents": { title: "Качество", context: "Инциденты и решения" },
  "/tasks": { title: "Обслуживание", context: "Задачи оператора" },
  "/parts": { title: "События", context: "Журнал деталей" },
  "/reports/shift": { title: "Аналитика", context: "Отчёт смены" },
  "/settings/operators": { title: "Настройки", context: "Роли и обучение" },
};

export function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith("/printers/")) return { title: "Принтеры", context: pathname.split("/").pop() ?? "Карточка" };
  if (pathname.endsWith("/slicer")) return { title: "Изделия", context: "Слайсер-поток" };
  return routeMeta[pathname] ?? routeMeta["/"];
}
