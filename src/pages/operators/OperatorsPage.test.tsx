import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import OperatorsPage from "./OperatorsPage";

describe("OperatorsPage", () => {
  it("unlocks destructive actions after the remaining onboarding scenarios", () => {
    render(<MemoryRouter><OperatorsPage /></MemoryRouter>);
    expect(screen.getByText("Деструктивные действия заблокированы")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Завершить mock-сценарий" }));
    fireEvent.click(screen.getByRole("button", { name: "Завершить mock-сценарий" }));
    expect(screen.getByText("Деструктивные действия доступны")).toBeInTheDocument();
  });

  it("requires an audit reason to change a role", () => {
    render(<MemoryRouter><OperatorsPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Изменить роль" }));
    const submit = screen.getByRole("button", { name: "Подтвердить изменение" });
    expect(submit).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Новая роль"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Например: отвечает за закрытие смены"), { target: { value: "Старший смены" } });
    fireEvent.click(submit);
    expect(screen.getAllByText("Администратор фермы").length).toBeGreaterThan(0);
  });
});
