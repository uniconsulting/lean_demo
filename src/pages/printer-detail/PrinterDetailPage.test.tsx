import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PrinterDetailPage from "./PrinterDetailPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/printers/K1C-04"]}>
      <Routes><Route path="/printers/:printerId" element={<PrinterDetailPage />} /></Routes>
    </MemoryRouter>,
  );
}

describe("Printer detail interactions", () => {
  it("shows the selected printer and its physical blocker", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "K1C-04" })).toBeVisible();
    expect(screen.getByText("Освободить тару годных деталей")).toBeVisible();
    expect(screen.getByAltText("Кадр печати K1C-04")).toBeVisible();
    expect(screen.getByLabelText("Печать завершена на 100 процентов")).toBeVisible();
  });

  it("toggles the live camera state", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Открыть live" }));
    expect(screen.getByRole("button", { name: "Остановить live" })).toBeVisible();
    expect(screen.getByText("LIVE")).toBeVisible();
  });

  it("completes the physical action and unlocks the cycle", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Подтвердить и продолжить" }));
    expect(screen.getByText("Цикл разблокирован")).toBeVisible();
    expect(screen.getByRole("button", { name: "Вернуть в работу" })).toBeVisible();
  });

  it("requires a confirmation surface for pause", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Пауза.*остановка/ }));
    const dialog = screen.getByRole("dialog", { name: "Приостановить K1C-04?" });
    expect(dialog).toBeVisible();
    expect(dialog.parentElement?.parentElement).toBe(document.body);
    expect(screen.getByRole("button", { name: "Подтвердить паузу" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(dialog).not.toBeInTheDocument();
  });

  it("keeps compact repeated copy on one line with the full value available as a tooltip", () => {
    renderPage();
    expect(screen.getByText("Разрешённые команды")).toBeVisible();
    expect(screen.getByText("роль: оператор")).toBeVisible();
    expect(screen.getByLabelText("Тара заполнена · весы · hardware")).toBeVisible();
    expect(screen.getByLabelText("Печать завершена · 412/412 слоёв")).toHaveAttribute("tabindex", "0");
  });
});
