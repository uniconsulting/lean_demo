import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PartsJournalPage from "./PartsJournalPage";

describe("PartsJournalPage", () => {
  it("filters records and opens traceability", () => {
    render(<MemoryRouter><PartsJournalPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Каждая деталь оставляет след" })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("ID, изделие, принтер, катушка…"), { target: { value: "PT-000270" } });
    fireEvent.click(screen.getByRole("button", { name: /PT-000270/ }));
    expect(screen.getByText("INC-148 · исход не закрыт")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Подтвердить годность" }));
    expect(screen.getAllByText("Годен").length).toBeGreaterThan(0);
  });

  it("confirms physical bin reconciliation", () => {
    render(<MemoryRouter><PartsJournalPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Сверить тару" }));
    expect(screen.getByRole("button", { name: "Совпадение подтверждено" })).toBeInTheDocument();
  });
});
