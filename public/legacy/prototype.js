(() => {
  const root = document.documentElement;
  const storedTheme = root.dataset.theme;
  const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  const pageCache = new Map();
  let navigationSequence = 0;

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

  const routeFromUrl = (url = location.href) => new URL(url, location.href).pathname.split("/").pop() || "01-shift-summary.html";

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

  const updateNavigation = (route) => {
    const nav = document.querySelector(".nav-group");
    if (!nav) return;

    if (nav.dataset.enhanced !== "true") {
      nav.innerHTML = navigation.map(([iconName, label, href, routes]) => (
        `<a class="nav-link" data-routes="${routes.join(" ")}" href="./${href}"><span class="nav-marker"><i data-lucide="${iconName}"></i></span>${label}</a>`
      )).join("");
      nav.dataset.enhanced = "true";
    }

    nav.querySelectorAll(".nav-link").forEach((link) => {
      const active = link.dataset.routes.split(" ").includes(route);
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const setupThemeToggle = () => {
    const commandbar = document.querySelector(".commandbar");
    if (!commandbar) return;

    let toggle = commandbar.querySelector(".theme-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "theme-toggle";
      toggle.type = "button";
      toggle.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
      commandbar.append(toggle);
    }
    applyTheme(root.dataset.theme || initialTheme);
  };

  const decoratePage = () => {
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
  };

  const hydratePage = (route = routeFromUrl()) => {
    updateNavigation(route);
    const brandDescriptor = document.querySelector(".brand-lockup small");
    if (brandDescriptor) brandDescriptor.textContent = "3D-ферма";
    setupThemeToggle();
    decoratePage();
    renderIcons();
    root.classList.add("ui-ready");
  };

  const isPrototypeLink = (link) => {
    if (!link || link.target && link.target !== "_self" || link.hasAttribute("download")) return false;
    const url = new URL(link.href, location.href);
    return url.origin === location.origin && url.pathname.endsWith(".html");
  };

  const loadPage = async (url) => {
    const key = url.pathname;
    if (!pageCache.has(key)) {
      pageCache.set(key, fetch(url.href, { headers: { "X-Requested-With": "LEN-Prototype" } }).then(async (response) => {
        if (!response.ok) throw new Error(`Page request failed: ${response.status}`);
        return response.text();
      }).catch((error) => {
        pageCache.delete(key);
        throw error;
      }));
    }
    return pageCache.get(key);
  };

  const navigateTo = async (targetUrl, historyMode = "push", force = false) => {
    const url = new URL(targetUrl, location.href);
    if (!force && url.href === location.href) return;
    if (location.protocol === "file:") {
      location.assign(url.href);
      return;
    }

    const sequence = ++navigationSequence;
    root.dataset.navigation = "pending";

    try {
      const markup = await loadPage(url);
      if (sequence !== navigationSequence) return;
      const parsed = new DOMParser().parseFromString(markup, "text/html");
      const incomingWorkbench = parsed.querySelector(".workbench");
      const currentWorkbench = document.querySelector(".workbench");
      if (!incomingWorkbench || !currentWorkbench) throw new Error("Prototype shell is incomplete");

      const swap = () => {
        currentWorkbench.replaceWith(incomingWorkbench);
        document.title = parsed.title;
        if (historyMode === "push") history.pushState({}, "", url.href);
        else if (historyMode === "replace") history.replaceState({}, "", url.href);
        hydratePage(routeFromUrl(url));
        window.scrollTo(0, 0);
      };

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !reduceMotion) {
        const transition = document.startViewTransition(swap);
        await transition.finished;
      } else {
        swap();
      }
    } catch {
      location.assign(url.href);
    } finally {
      if (sequence === navigationSequence) delete root.dataset.navigation;
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!isPrototypeLink(link) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateTo(link.href);
  });

  const preloadLinkedPage = (event) => {
    const link = event.target.closest("a[href]");
    if (!isPrototypeLink(link) || location.protocol === "file:") return;
    loadPage(new URL(link.href, location.href)).catch(() => {});
  };
  document.addEventListener("pointerover", preloadLinkedPage);
  document.addEventListener("focusin", preloadLinkedPage);
  addEventListener("popstate", () => navigateTo(location.href, "none", true));

  hydratePage();
})();
