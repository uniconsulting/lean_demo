import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OperatorTasksPage from "./OperatorTasksPage";

function renderPage() { return render(<MemoryRouter><OperatorTasksPage /></MemoryRouter>); }

describe("OperatorTasksPage", () => {
  it("shows the priority task and its verified effect", () => {
    renderPage();
    expect(screen.getByRole("tablist", { name: "Фильтры задач" })).toBeInTheDocument();
    expect(screen.getByText("блокируют ночь")).toBeInTheDocument();
    expect(screen.getAllByText("Освободить тару годных деталей").length).toBeGreaterThan(0);
    expect(screen.getAllByText("8 принтеров и ночной preflight стойки A")).toHaveLength(2);
  });

  it("switches the selected physical task", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Заменить катушку PETG/ }));
    expect(screen.getByRole("heading", { name: "Заменить катушку PETG" })).toBeInTheDocument();
    expect(screen.getByText("RFID новой катушки считан")).toBeInTheDocument();
  });

  it("requires checklist and sensor confirmation before completion", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Взять в работу" }));
    fireEvent.click(screen.getByRole("button", { name: /Переместить детали в постобработку/ }));
    fireEvent.click(screen.getByRole("button", { name: /Вернуть пустую тару в ячейку A-17/ }));
    fireEvent.click(screen.getByRole("button", { name: /Дождаться подтверждения весов/ }));
    fireEvent.click(screen.getByRole("button", { name: "Завершить задачу" }));
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить mock-датчик" }));
    expect(screen.getByRole("heading", { name: "Результат подтверждён" })).toBeInTheDocument();
    expect(screen.getByText("блокер снят")).toBeInTheDocument();
  });

  it("creates a local manual task from the fullscreen dialog", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Создать вручную" }));
    fireEvent.change(screen.getByPlaceholderText("Например: проверить сопло K1C-03"), { target: { value: "Проверить сопло K1C-03" } });
    fireEvent.click(screen.getByRole("button", { name: "Создать mock-задачу" }));
    expect(screen.getByText(/TASK-191 добавлена/)).toBeInTheDocument();
  });
});
