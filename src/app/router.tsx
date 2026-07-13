import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { PlaceholderPage } from "../pages/placeholder/PlaceholderPage";
import { RouteSkeleton } from "../components/ui/RouteSkeleton";

const ShiftSummaryPage = lazy(() => import("../pages/shift-summary/ShiftSummaryPage"));
const FarmPage = lazy(() => import("../pages/farm/FarmPage"));
const PrinterDetailPage = lazy(() => import("../pages/printer-detail/PrinterDetailPage"));
const QueuePage = lazy(() => import("../pages/queue/QueuePage"));
const NightPage = lazy(() => import("../pages/night/NightPage"));
const ProductsPage = lazy(() => import("../pages/products/ProductsPage"));
const ProductOnboardingPage = lazy(() => import("../pages/product-onboarding/ProductOnboardingPage"));
const SlicerPage = lazy(() => import("../pages/slicer/SlicerPage"));
const IncidentsPage = lazy(() => import("../pages/incidents/IncidentsPage"));
const OperatorTasksPage = lazy(() => import("../pages/operator-tasks/OperatorTasksPage"));
const PartsJournalPage = lazy(() => import("../pages/parts-journal/PartsJournalPage"));
const ShiftReportPage = lazy(() => import("../pages/shift-report/ShiftReportPage"));

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

function QueueRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <QueuePage />
    </Suspense>
  );
}

function NightRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <NightPage />
    </Suspense>
  );
}

function ProductsRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ProductsPage />
    </Suspense>
  );
}

function ProductOnboardingRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ProductOnboardingPage />
    </Suspense>
  );
}

function SlicerRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <SlicerPage />
    </Suspense>
  );
}

function IncidentsRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <IncidentsPage />
    </Suspense>
  );
}

function OperatorTasksRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <OperatorTasksPage />
    </Suspense>
  );
}

function PartsJournalRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <PartsJournalPage />
    </Suspense>
  );
}

function ShiftReportRoute() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ShiftReportPage />
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
        <Route path="queue" element={<QueueRoute />} />
        <Route path="night" element={<NightRoute />} />
        <Route path="products" element={<ProductsRoute />} />
        <Route path="products/new" element={<ProductOnboardingRoute />} />
        <Route path="products/:productId/slicer" element={<SlicerRoute />} />
        <Route path="incidents" element={<IncidentsRoute />} />
        <Route path="tasks" element={<OperatorTasksRoute />} />
        <Route path="parts" element={<PartsJournalRoute />} />
        <Route path="reports/shift" element={<ShiftReportRoute />} />
        <Route path="settings/operators" element={<PlaceholderPage section="Роли и onboarding" legacy="13-roles-onboarding.html" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
