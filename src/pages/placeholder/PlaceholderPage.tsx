import { ArrowLeft, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./PlaceholderPage.module.css";

type PlaceholderPageProps = {
  section: string;
  legacy: string;
};

export function PlaceholderPage({ section, legacy }: PlaceholderPageProps) {
  return (
    <section className={styles.placeholder}>
      <div className={styles.icon}><Layers3 aria-hidden="true" /></div>
      <p>ЭТАП ПОСЛЕ GOLDEN SCREEN</p>
      <h1>{section}</h1>
      <span>Раздел сохранён в legacy-прототипе и будет перенесён после ручного утверждения новой «Сводки смены».</span>
      <div className={styles.actions}>
        <Link to="/"><ArrowLeft aria-hidden="true" />Вернуться к сводке</Link>
        <a href={`./legacy/${legacy}`}>Открыть прежний экран</a>
      </div>
    </section>
  );
}
