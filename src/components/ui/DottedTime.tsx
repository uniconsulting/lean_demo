import styles from "./DottedTime.module.css";

type DottedTimeProps = {
  hours: string;
  minutes: string;
};

export function DottedTime({ hours, minutes }: DottedTimeProps) {
  return (
    <span className={styles.time} aria-label={`${hours} часов ${minutes} минут`}>
      <span>{hours}</span>
      <i aria-hidden="true">:</i>
      <span>{minutes}</span>
    </span>
  );
}
