import styles from "./RouteSkeleton.module.css";

export function RouteSkeleton() {
  return <div className={styles.skeleton} aria-label="Загрузка раздела"><span /><span /><span /></div>;
}
