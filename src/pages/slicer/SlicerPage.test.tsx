import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SlicerPage from "./SlicerPage";

function renderPage() {
  return render(<MemoryRouter initialEntries={["/products/P-042/slicer"]}><Routes><Route path="products/:productId/slicer" element={<SlicerPage />} /></Routes></MemoryRouter>);
}

describe("SlicerPage", () => {
  it("shows the transparent pipeline and required macros", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Слайсер как прозрачный поток" })).toBeInTheDocument();
    expect(screen.getByText("FIRST_LAYER_CHECKPOINT")).toBeInTheDocument();
    expect(screen.getByText("COOLDOWN_EJECT")).toBeInTheDocument();
  });

  it("runs the mock slice through to a ready artifact", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Запустить слайсинг/ }));
    expect(screen.getByText("Orca CLI выполняет слайсинг")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /Завершить mock/ })[0]);
    expect(screen.getByText("Артефакт готов к производству")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Создать задание/ })).toBeInTheDocument();
  });

  it("turns uploaded G-code into a traceable artifact", () => {
    renderPage();
    fireEvent.click(screen.getByRole("tab", { name: "Готовый G-code" }));
    fireEvent.click(screen.getByRole("button", { name: "Имитировать загрузку" }));
    expect(screen.getByRole("heading", { name: "Готовый G-code проверен" })).toBeInTheDocument();
    expect(screen.getAllByText("обнаружен и зафиксирован")).toHaveLength(4);
  });

  it("resolves a missing profile blocker locally", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Назначить профиль" }));
    expect(screen.getByText("Готов к запуску")).toBeInTheDocument();
    expect(screen.getByText("профиль назначен")).toBeInTheDocument();
  });
});
