import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProductOnboardingPage from "./ProductOnboardingPage";

function renderPage() {
  return render(<MemoryRouter><ProductOnboardingPage /></MemoryRouter>);
}

describe("Product onboarding flow", () => {
  it("starts from a verified slicing result", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Из модели — в надёжную серию" })).toBeVisible();
    expect(screen.getByText("FIRST_LAYER_CHECKPOINT")).toBeVisible();
    expect(screen.getByText("Макросы вставлены")).toBeVisible();
  });

  it("creates calibration jobs on mock data", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getAllByRole("button", { name: /Создать 3 печати/ })[0]);
    expect(screen.getByRole("heading", { name: "Калибровочные печати" })).toBeVisible();
    expect(screen.getByText("P-042-C01")).toBeVisible();
  });

  it("requires human review before admission", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getAllByRole("button", { name: /Создать 3 печати/ })[0]);
    await user.click(screen.getByRole("button", { name: /Завершить mock-печати/ }));
    const admission = screen.getByRole("button", { name: /Принято 0 из 3/ });
    expect(admission).toBeDisabled();
    const references = screen.getAllByRole("button", { name: "Принять эталон" });
    for (const reference of references) await user.click(reference);
    expect(screen.getByRole("button", { name: /Выдать допуск к серии/ })).toBeEnabled();
  });

  it("issues series admission after three accepted references", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getAllByRole("button", { name: /Создать 3 печати/ })[0]);
    await user.click(screen.getByRole("button", { name: /Завершить mock-печати/ }));
    for (const reference of screen.getAllByRole("button", { name: "Принять эталон" })) await user.click(reference);
    await user.click(screen.getByRole("button", { name: /Выдать допуск к серии/ }));
    expect(screen.getByRole("heading", { name: "Допуск к серии выдан" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Открыть библиотеку/ })).toBeVisible();
  });
});
