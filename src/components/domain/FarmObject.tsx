import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle } from "lucide-react";
import type { PrinterState, PrinterView } from "../../data/types";
import styles from "./FarmObject.module.css";

const racks = ["A", "B", "C", "D", "E"];

const stateLabels: Record<PrinterState, string> = {
  printing: "Печатает",
  finishing: "Завершает",
  waiting: "Ожидает",
  fault: "Ошибка",
};

const stateIcons = {
  printing: LoaderCircle,
  finishing: CheckCircle2,
  waiting: Clock3,
  fault: AlertTriangle,
};

type FarmObjectProps = {
  printers: PrinterView[];
  blockersOnly: boolean;
  selectedPrinter: string;
  onSelect: (printerId: string) => void;
};

export function FarmObject({ printers, blockersOnly, selectedPrinter, onSelect }: FarmObjectProps) {
  return (
    <div className={styles.farmObject} aria-label="Физическая карта фермы">
      <div className={styles.rackStack}>
        {racks.map((rack) => {
          const rackPrinters = printers.filter((printer) => printer.rack === rack);
          const visiblePrinters = blockersOnly ? rackPrinters.filter((printer) => printer.state === "waiting" || printer.state === "fault") : rackPrinters;
          return (
            <section className={styles.rack} key={rack} aria-label={`Стеллаж ${rack}`}>
              <header><strong>{rack}</strong><span>{rackPrinters.length} принтеров</span></header>
              <div className={styles.printerGrid}>
                {visiblePrinters.map((printer) => {
                  const StateIcon = stateIcons[printer.state];
                  return (
                    <button
                      className={`${styles.printer} ${styles[printer.state]} ${selectedPrinter === printer.id ? styles.selected : ""}`}
                      key={printer.id}
                      type="button"
                      onClick={() => onSelect(printer.id)}
                      aria-pressed={selectedPrinter === printer.id}
                    >
                      <span><StateIcon aria-hidden="true" />{printer.id}</span>
                      <small>{printer.detail}</small>
                      <em>{stateLabels[printer.state]}</em>
                    </button>
                  );
                })}
                {blockersOnly && visiblePrinters.length === 0 ? <div className={styles.clearRack}>Нет блокеров</div> : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
