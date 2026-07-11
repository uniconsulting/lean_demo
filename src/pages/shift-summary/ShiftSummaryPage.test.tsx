import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ShiftSummaryPage from "./ShiftSummaryPage";

function renderPage() {
  return render(<MemoryRouter><ShiftSummaryPage /></MemoryRouter>);
}

describe("Shift summary interactions", () => {
  it("filters the farm to blockers", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Блокеры" }));
    expect(screen.getByRole("button", { name: /D3/ })).toBeVisible();
    expect(screen.queryByRole("button", { name: /A1/ })).not.toBeInTheDocument();
  });

  it("updates the selected printer context", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /A1/ }));
    expect(within(screen.getByTestId("selected-object")).getByText("64% · Корпус")).toBeVisible();
  });

  it("closes and restores the next action", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Я выполнил" }));
    expect(screen.getByRole("heading", { name: "Тара освобождена" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Вернуть в работу" }));
    expect(screen.getByRole("heading", { name: "Освободить тару годных деталей" })).toBeVisible();
  });
});
