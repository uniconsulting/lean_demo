import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { PlaceholderPage } from "../pages/placeholder/PlaceholderPage";
import { RouteSkeleton } from "../components/ui/RouteSkeleton";

const ShiftSummaryPage = lazy(() => import("../pages/shift-summary/ShiftSummaryPage"));
const FarmPage = lazy(() => import("../pages/farm/FarmPage"));
const PrinterDetailPage = lazy(() => import("../pages/printer-detail/PrinterDetailPage"));

function GoldenRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ShiftSummaryPage />
    </Suspense>
  );
}

function FarmRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <FarmPage />
    </Suspense>
  );
}

function PrinterDetailRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <PrinterDetailPage />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<GoldenRoute />} />
        <Route path="farm" element={<FarmRoute />} />
        <Route path="printers/:printerId" element={<PrinterDetailRoute />} />
        <Route path="queue" element={<PlaceholderPage section="Очередь" legacy="03-queue.html" />} />
        <Route path="night" element={<PlaceholderPage section="Зарядить ночь" legacy="04-night-charge.html" />} />
        <Route path="products" element={<PlaceholderPage section="Библиотека изделий" legacy="06-products-library.html" />} />
        <Route path="products/new" element={<PlaceholderPage section="Onboarding изделия" legacy="07-product-onboarding.html" />} />
        <Route path="products/:productId/slicer" element={<PlaceholderPage section="Слайсер-поток" legacy="08-slicer-flow.html" />} />
        <Route path="incidents" element={<PlaceholderPage section="Инциденты" legacy="09-incidents.html" />} />
        <Route path="tasks" element={<PlaceholderPage section="Задачи оператора" legacy="10-operator-tasks.html" />} />
        <Route path="parts" element={<PlaceholderPage section="Журнал деталей" legacy="12-parts-journal.html" />} />
        <Route path="reports/shift" element={<PlaceholderPage section="Отчёт смены" legacy="11-shift-report.html" />} />
        <Route path="settings/operators" element={<PlaceholderPage section="Роли и onboarding" legacy="13-roles-onboarding.html" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
