(() => {
  const routes = {
    "01-shift-summary.html": "/",
    "02-park-map.html": "/farm",
    "03-queue.html": "/queue",
    "04-night-charge.html": "/night",
    "05-printer-detail.html": "/printers/K1C-04",
    "06-products-library.html": "/products",
    "07-product-onboarding.html": "/products/new",
    "08-slicer-flow.html": "/products/P-042/slicer",
    "09-incidents.html": "/incidents",
    "10-operator-tasks.html": "/tasks",
    "11-shift-report.html": "/reports/shift",
    "12-parts-journal.html": "/parts",
    "13-roles-onboarding.html": "/settings/operators",
  };
  const file = location.pathname.split("/").pop();
  const route = routes[file] || "/";
  location.replace(`./#${route}`);
})();
