import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import IncidentsPage from "./IncidentsPage";

function renderPage() { return render(<MemoryRouter><IncidentsPage /></MemoryRouter>); }

describe("IncidentsPage", () => {
  it("explains the ABS human-review incident", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Не сигнал, а понятное решение" })).toBeInTheDocument();
    expect(screen.getByText("ABS / ASA: только алерт")).toBeInTheDocument();
    expect(screen.getByText("Эскалировать человеку, печать продолжить")).toBeInTheDocument();
  });

  it("switches evidence frames", () => {
    renderPage();
    const frame = screen.getByRole("button", { name: "Кадр 3" });
    fireEvent.click(frame);
    expect(frame).toHaveAttribute("aria-pressed", "true");
  });

  it("records a false positive human outcome", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Ложное срабатывание" }));
    fireEvent.click(screen.getByRole("button", { name: "Сохранить опровержение" }));
    expect(screen.getByRole("heading", { name: "Ложное срабатывание сохранено" })).toBeInTheDocument();
    expect(screen.getByText("Вердикт помечен как false positive")).toBeInTheDocument();
  });

  it("requires a separate confirmation for mock cancel", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить cancel" }));
    expect(screen.getByRole("dialog", { name: "Подтвердить cancel печати?" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить mock-cancel" }));
    expect(screen.getByRole("heading", { name: "Cancel подтверждён" })).toBeInTheDocument();
  });
});
