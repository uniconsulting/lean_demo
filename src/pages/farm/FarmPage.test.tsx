import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FarmPage from "./FarmPage";

function renderPage() {
  return render(<MemoryRouter><FarmPage /></MemoryRouter>);
}

describe("Farm page interactions", () => {
  it("opens with the physical blocker selected", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "K1C-04" })).toBeVisible();
    expect(screen.getByText("Тара годных заполнена на 92%")).toBeVisible();
  });

  it("selects a printer and updates its context", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "K1C-01, Печатает, PLA · серый" }));
    expect(screen.getByRole("heading", { name: "K1C-01" })).toBeVisible();
    expect(screen.getByText("Дождаться завершения печати.")).toBeVisible();
  });

  it("switches to control-only and updates manual occupancy", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Control-only" }));
    expect(screen.getByRole("heading", { name: "CTRL-01" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Отметить свободным" }));
    expect(screen.getByRole("button", { name: "Отметить занятым" })).toBeVisible();
  });

  it("toggles the selected printer live frame", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Открыть live-кадр" }));
    expect(screen.getByRole("button", { name: "Закрыть live-кадр" })).toBeVisible();
    expect(screen.getByText("LIVE")).toBeVisible();
  });
});
