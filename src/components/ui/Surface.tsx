import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "./Surface.module.css";

type SurfaceTone = "base" | "soft" | "dark" | "success" | "info" | "warning" | "danger";

type SurfaceProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  tone?: SurfaceTone;
};

export function Surface({ children, tone = "base", className = "", ...props }: SurfaceProps) {
  return <section className={`${styles.surface} ${styles[tone]} ${className}`} {...props}>{children}</section>;
}
