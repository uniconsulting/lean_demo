import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { initialQueueJobs, reorderQueue } from "../../data/queue";
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

  it("exposes a single drag handle without arrow controls", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "Переместить Кронштейн-12" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Поднять Кронштейн-12" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Опустить Кронштейн-12" })).not.toBeInTheDocument();
  });

  it("reorders jobs and recalculates their positions", () => {
    const reordered = reorderQueue(initialQueueJobs, "024", "041");
    expect(reordered[0]).toMatchObject({ id: "024", position: 1 });
    expect(reordered[1]).toMatchObject({ id: "041", position: 2 });
  });

  it("requires confirmation before canceling", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Отменить задание" }));
    expect(screen.getByRole("dialog", { name: "Отменить задание #024?" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Подтвердить отмену" })).toBeVisible();
  });
});
