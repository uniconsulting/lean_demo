import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NightPage from "./NightPage";

function renderPage() { return render(<MemoryRouter><NightPage /></MemoryRouter>); }

describe("Night protocol interactions", () => {
  it("starts with two physical blockers and disabled approval", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Зарядить ночь" })).toBeVisible();
    expect(screen.getByText("Ночь не готова")).toBeVisible();
    expect(screen.getByRole("button", { name: "Подтвердить ночь" })).toBeDisabled();
  });

  it("resolves both blockers and approves the night", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Я освободил тару" }));
    await user.click(screen.getByRole("button", { name: "Катушка заменена" }));
    const approveButtons = screen.getAllByRole("button", { name: "Подтвердить ночь" });
    expect(approveButtons[0]).toBeEnabled();
    await user.click(approveButtons[0]);
    expect(screen.getAllByText("Ночь подтверждена").length).toBeGreaterThanOrEqual(1);
  });

  it("allows excluding K1C-06 and recalculates coverage", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Исключить K1C-06" }));
    expect(screen.getByText("15 ч 20 мин")).toBeVisible();
    expect(screen.getByText("K1C-06 исключён из ночи")).toBeVisible();
  });
});
