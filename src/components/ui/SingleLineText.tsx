import type { ElementType } from "react";
import styles from "./SingleLineText.module.css";

type SingleLineTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
};

export function SingleLineText({ text, as: Tag = "span", className = "" }: SingleLineTextProps) {
  return (
    <Tag className={`${styles.root} ${className}`} aria-label={text} tabIndex={0}>
      <span className={styles.value}>{text}</span>
      <span className={styles.tooltip} role="tooltip" aria-hidden="true">{text}</span>
    </Tag>
  );
}
