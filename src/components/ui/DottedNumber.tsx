import type { ReactNode } from "react";
import styles from "./DottedNumber.module.css";

export function DottedNumber({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <span className={`${styles.number} ${compact ? styles.compact : ""}`}>{children}</span>;
}
