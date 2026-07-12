import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProductsPage from "./ProductsPage";

function renderPage() {
  return render(<MemoryRouter><ProductsPage /></MemoryRouter>);
}

describe("Products page interactions", () => {
  it("shows the production catalog and selected product", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Библиотека изделий" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Кронштейн-12" })).toBeVisible();
    expect(screen.getByText("night allowed")).toBeVisible();
  });

  it("selects a blocked product and explains the blocker", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Открыть Заглушка корпуса" }));
    expect(screen.getByRole("heading", { name: "Заглушка корпуса" })).toBeVisible();
    expect(screen.getByText("Нет производственного профиля для связки K1C · PLA · PEI.")).toBeVisible();
    expect(screen.getByRole("link", { name: /Продолжить onboarding/ })).toBeVisible();
  });

  it("filters calibrating products", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Калибровка/ }));
    expect(screen.getByRole("button", { name: "Открыть Кожух вентилятора" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Открыть Кронштейн-12" })).not.toBeInTheDocument();
  });

  it("creates a mock series from an approved product", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Поставить серию/ }));
    expect(screen.getByRole("dialog", { name: "Кронштейн-12" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Создать серию/ }));
    expect(screen.getByRole("heading", { name: "Кронштейн-12 добавлен в очередь" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Открыть очередь/ })).toBeVisible();
  });
});
