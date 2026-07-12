import { Moon, Sun, UserRound } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LiveDot } from "../components/ui/LiveDot";
import { navigationItems, getRouteMeta } from "./navigation";
import { useTheme } from "./ThemeProvider";
import styles from "./AppShell.module.css";

export function AppShell() {
  const location = useLocation();
  const meta = getRouteMeta(location.pathname);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.shell} data-testid="app-shell">
      <aside className={styles.sidebar}>
        <div className={styles.brand} aria-label="ЛЁН, 3D-ферма">
          <strong>ЛЁН</strong>
          <span>3D-ФЕРМА</span>
        </div>

        <nav className={styles.navigation} aria-label="Основная навигация">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(location.pathname);
            return (
              <NavLink
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.shiftCard}>
          <span>НОЧНАЯ СМЕНА</span>
          <strong>22:00 — 06:00</strong>
          <small>Edge в сети · 8 автономных</small>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.commandBar}>
          <div className={styles.commandIdentity}>
            <span>{meta.title}</span>
            <strong>{meta.context}</strong>
          </div>
          <div className={styles.onlineState}><LiveDot />Edge в сети</div>
          <div className={styles.commandDivider} aria-hidden="true" />
          <strong className={styles.employeeName}>Анна</strong>
          <button className={`${styles.headerButton} ${styles.profileButton}`} type="button" aria-label="Открыть профиль Анны">
            <UserRound aria-hidden="true" />
          </button>
          <button className={`${styles.headerButton} ${styles.themeToggle}`} type="button" onClick={toggleTheme} aria-label={theme === "light" ? "Включить ночную тему" : "Включить светлую тему"}>
            {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
        </header>

        <main className={styles.routeStage} key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
