import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import QueuePage from "./QueuePage";

function renderPage() { return render(<MemoryRouter><QueuePage /></MemoryRouter>); }

describe("Queue page interactions", () => {
  it("shows night coverage and the selected series", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Очередь серий" })).toBeVisible();
    expect(screen.getByText("18 ч 40 мин")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Кронштейн-12 v3" })).toBeVisible();
  });

  it("selects another job and updates the context rail", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Открыть Кожух вентилятора" }));
    expect(screen.getByRole("heading", { name: "Кожух вентилятора v4" })).toBeVisible();
    expect(screen.getByText("K1C · PETG · PEI")).toBeVisible();
  });

  it("reorders a queued job", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Поднять Кронштейн-12" }));
    expect(screen.getByRole("article", { name: "1. Кронштейн-12, следующее" })).toBeVisible();
  });

  it("requires confirmation before canceling", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Отменить задание" }));
    expect(screen.getByRole("dialog", { name: "Отменить задание #024?" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Подтвердить отмену" })).toBeVisible();
  });
});
