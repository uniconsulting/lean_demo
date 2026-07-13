import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

type ModalProps = {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  className?: string;
};

export function Modal({ children, labelledBy, onClose, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className={`${styles.dialog} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.close} type="button" onClick={onClose} aria-label="Закрыть">
          <X aria-hidden="true" />
        </button>
        {children}
      </section>
    </div>,
    document.body,
  );
}
