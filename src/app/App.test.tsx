import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

describe("App shell", () => {
  beforeEach(() => {
    window.location.hash = "#/";
    document.documentElement.dataset.theme = "light";
    localStorage.clear();
  });

  it("opens the shift summary by default", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Смена под контролем" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Основная навигация" })).toBeVisible();
  });

  it("keeps the app shell mounted while changing routes", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Смена под контролем" });
    const shell = screen.getByTestId("app-shell");
    await user.click(screen.getByRole("link", { name: "Ферма" }));
    expect(await screen.findByRole("heading", { name: "Ферма" })).toBeVisible();
    expect(screen.getByTestId("app-shell")).toBe(shell);
  });

  it("persists theme choice", async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = await screen.findByRole("button", { name: "Включить ночную тему" });
    await user.click(toggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("len-ui-theme")).toBe("dark");
  });
});
