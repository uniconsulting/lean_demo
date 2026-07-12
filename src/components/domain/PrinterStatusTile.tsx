import styles from "./PrinterStatusTile.module.css";

export type PrinterStatusTone = "printing" | "finishing" | "waiting" | "ready";

type PrinterStatusTileProps = {
  id: string;
  status: string;
  tone: PrinterStatusTone;
  job: string;
  material: string;
  trailing: string;
  selected?: boolean;
  muted?: boolean;
  compact?: boolean;
  onSelect?: (id: string) => void;
};

export function PrinterStatusTile({ id, status, tone, job, material, trailing, selected = false, muted = false, compact = false, onSelect }: PrinterStatusTileProps) {
  const className = `${styles.tile} ${styles[tone]} ${selected ? styles.selected : ""} ${muted ? styles.muted : ""} ${compact ? styles.compact : ""}`;
  const content = <><div className={styles.visual} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/printer-k1.svg`} alt="" /></div><div className={styles.copy}><div><strong>{id}</strong><span><i />{status}</span></div><p>{job}</p><footer><span>{material}</span><b>{trailing}</b></footer></div></>;

  return onSelect ? <button className={className} type="button" onClick={() => onSelect(id)} aria-pressed={selected} aria-label={`${id}, ${status}, ${material}`}>{content}</button> : <article className={className} aria-label={`${id}, ${status}, ${material}`}>{content}</article>;
}
