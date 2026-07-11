(() => {
  const root = document.documentElement;
  root.classList.add("prototype-js");

  try {
    const stored = localStorage.getItem("len-prototype-theme");
    root.dataset.theme = stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    root.dataset.theme = "dark";
  }
})();
