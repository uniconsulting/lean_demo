(() => {
  const root = document.documentElement;
  const storedTheme = root.dataset.theme;
  const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";

  const renderIcons = () => {
    if (window.lucide?.createIcons) {
      window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
    }
  };

  const applyTheme = (nextTheme, animate = false) => {
    const update = () => {
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem("len-prototype-theme", nextTheme);
      } catch {
        // The theme still works when persistent storage is unavailable.
      }

      const toggle = document.querySelector(".theme-toggle");
      if (!toggle) return;
      const target = nextTheme === "dark" ? "light" : "dark";
      toggle.innerHTML = `<i data-lucide="${target === "light" ? "sun" : "moon"}"></i>`;
      toggle.setAttribute("aria-label", target === "light" ? "Включить светлую тему" : "Включить ночную тему");
      toggle.setAttribute("title", target === "light" ? "Светлая тема" : "Ночная тема");
      renderIcons();
    };

    if (animate && document.startViewTransition) document.startViewTransition(update);
    else update();
  };

  const route = location.pathname.split("/").pop() || "01-shift-summary.html";
  const navigation = [
    ["layout-dashboard", "Сводка смены", "01-shift-summary.html", ["01-shift-summary.html", "04-night-charge.html"]],
    ["factory", "Ферма", "02-park-map.html", ["02-park-map.html"]],
    ["printer", "Принтеры", "05-printer-detail.html", ["05-printer-detail.html"]],
    ["list-ordered", "Очередь", "03-queue.html", ["03-queue.html"]],
    ["boxes", "Изделия", "06-products-library.html", ["06-products-library.html", "07-product-onboarding.html", "08-slicer-flow.html"]],
    ["shield-check", "Качество", "09-incidents.html", ["09-incidents.html"]],
    ["wrench", "Обслуживание", "10-operator-tasks.html", ["10-operator-tasks.html"]],
    ["scroll-text", "События", "12-parts-journal.html", ["12-parts-journal.html"]],
    ["chart-no-axes-combined", "Аналитика", "11-shift-report.html", ["11-shift-report.html"]],
    ["settings", "Настройки", "13-roles-onboarding.html", ["13-roles-onboarding.html"]],
  ];

  const nav = document.querySelector(".nav-group");
  if (nav) {
    nav.innerHTML = navigation.map(([iconName, label, href, routes]) => {
      const active = routes.includes(route) ? " active" : "";
      return `<a class="nav-link${active}" href="./${href}"><span class="nav-marker"><i data-lucide="${iconName}"></i></span>${label}</a>`;
    }).join("");
  }

  const brandDescriptor = document.querySelector(".brand-lockup small");
  if (brandDescriptor) brandDescriptor.textContent = "3D-ферма";

  const commandbar = document.querySelector(".commandbar");
  if (commandbar) {
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
    commandbar.append(toggle);
    applyTheme(theme);
  }

  document.querySelectorAll(".section-link").forEach((link) => {
    if (!link.querySelector("[data-lucide]")) link.insertAdjacentHTML("beforeend", '<i data-lucide="external-link"></i>');
  });

  document.querySelectorAll(".file-mark").forEach((mark) => {
    if (!mark.querySelector("[data-lucide]")) mark.innerHTML = '<i data-lucide="file-box"></i>';
  });

  document.querySelectorAll(".camera-frame").forEach((frame) => {
    if (!frame.querySelector(".camera-placeholder-icon")) frame.insertAdjacentHTML("beforeend", '<i class="camera-placeholder-icon" data-lucide="camera"></i>');
  });

  document.querySelectorAll(".check-mark").forEach((mark) => {
    const value = mark.textContent.trim();
    if (value === "✓") mark.innerHTML = '<i data-lucide="check"></i>';
    if (value === "!") mark.innerHTML = '<i data-lucide="triangle-alert"></i>';
  });

  document.querySelectorAll(".action-number").forEach((mark) => {
    const value = mark.textContent.trim();
    const iconName = value === "04" ? "package-x" : value === "02" ? "clock-3" : "trash-2";
    mark.innerHTML = `<i data-lucide="${iconName}"></i>`;
  });

  renderIcons();
  root.classList.add("ui-ready");

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href$=".html"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;

    event.preventDefault();
    root.classList.add("ui-leaving");
    setTimeout(() => location.assign(link.href), 90);
  });
})();
