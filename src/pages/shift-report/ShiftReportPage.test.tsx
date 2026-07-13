import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ShiftReportPage from "./ShiftReportPage";

describe("ShiftReportPage", () => {
  it("keeps closing blocked until both reconciliations are complete", () => {
    render(<MemoryRouter><ShiftReportPage /></MemoryRouter>);
    const closeButton = screen.getByRole("button", { name: "Закрыть смену" });
    expect(closeButton).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить mock" }));
    expect(closeButton).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Сверить mock" }));
    expect(closeButton).toBeEnabled();
    fireEvent.click(closeButton);
    expect(screen.getByRole("heading", { name: "Ночная смена закрыта" })).toBeInTheDocument();
    expect(screen.getByText("Итог зафиксирован")).toBeInTheDocument();
  });

  it("exports independently from report closing", () => {
    render(<MemoryRouter><ShiftReportPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Экспорт CSV" }));
    expect(screen.getByText("shift-2026-07-08.csv подготовлен")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Закрыть смену" })).toBeDisabled();
  });
});
