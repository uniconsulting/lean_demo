import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleGauge,
  Clock3,
  PackageOpen,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FarmObject } from "../../components/domain/FarmObject";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { Surface } from "../../components/ui/Surface";
import { printers, shiftEvents, stateTotals } from "../../data/shiftSummary";
import type { SemanticTone } from "../../data/types";
import styles from "./ShiftSummaryPage.module.css";

const toneClass: Record<SemanticTone, string> = {
  success: styles.success,
  info: styles.info,
  warning: styles.warning,
  danger: styles.danger,
  neutral: styles.neutral,
};

function MicroBars({ variant }: { variant: "output" | "quality" | "queue" }) {
  return (
    <div className={`${styles.microBars} ${styles[variant]}`} aria-hidden="true">
      {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
    </div>
  );
}

export default function ShiftSummaryPage() {
  const [blockersOnly, setBlockersOnly] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState("D3");
  const [actionDone, setActionDone] = useState(false);

  const selected = useMemo(() => printers.find((printer) => printer.id === selectedPrinter) ?? printers[0], [selectedPrinter]);

  return (
    <div className={styles.page}>
      <div className={styles.primaryColumn}>
        <Surface className={styles.farmHero}>
          <div className={styles.heroHeader}>
            <div>
              <div className={styles.heroStatus}><i aria-hidden="true" />Все критические показатели в норме</div>
              <h1>Смена под контролем</h1>
              <p>Физическая картина фермы, выпуск и следующее действие — в одном рабочем кадре.</p>
            </div>
            <div className={styles.heroControls}>
              <div className={styles.selectedObject} data-testid="selected-object">
                <span>ВЫБРАН</span>
                <strong>{selected.id}</strong>
                <small>{selected.detail}</small>
              </div>
              <div className={styles.segmented} aria-label="Фильтр карты">
                <button className={!blockersOnly ? styles.segmentActive : ""} type="button" onClick={() => setBlockersOnly(false)}>Вся ферма</button>
                <button className={blockersOnly ? styles.segmentActive : ""} type="button" onClick={() => setBlockersOnly(true)}>Блокеры</button>
              </div>
            </div>
          </div>

          <div className={styles.farmComposition}>
            <FarmObject printers={printers} blockersOnly={blockersOnly} selectedPrinter={selectedPrinter} onSelect={setSelectedPrinter} />
            <div className={styles.stateConstellation}>
              {stateTotals.map((state) => (
                <div className={`${styles.stateItem} ${styles[state.tone]}`} key={state.label}>
                  <DottedNumber compact>{state.value}</DottedNumber>
                  <span>{state.label}</span>
                </div>
              ))}
              <Link className={styles.mapLink} to="/farm">Открыть карту <ArrowUpRight aria-hidden="true" /></Link>
            </div>
          </div>
        </Surface>

        <section className={styles.metricStory} aria-label="Производственные показатели">
          <Surface tone="success" className={styles.metricFeature}>
            <div className={styles.metricTop}><Sparkles aria-hidden="true" /><span>ВЫПУСК ЗА СМЕНУ</span></div>
            <div><DottedNumber>1 248</DottedNumber><small>деталей</small></div>
            <p><strong>+12%</strong> к плану · 2,8 кг годных</p>
            <MicroBars variant="output" />
          </Surface>

          <Surface tone="info" className={styles.metricFeature}>
            <div className={styles.metricTop}><CircleGauge aria-hidden="true" /><span>ПЕРВЫЙ ПРОХОД</span></div>
            <div><DottedNumber>96,4</DottedNumber><small>%</small></div>
            <p><strong>46</strong> отклонено · 18 перепечатано</p>
            <MicroBars variant="quality" />
          </Surface>

          <Surface className={styles.queueMetric}>
            <div className={styles.metricTop}><Clock3 aria-hidden="true" /><span>ПОКРЫТИЕ ОЧЕРЕДИ</span></div>
            <div><DottedNumber>13:20</DottedNumber><small>часов</small></div>
            <p>Цель ночи — 16 часов</p>
            <MicroBars variant="queue" />
            <Link to="/queue">Открыть очередь <ArrowUpRight aria-hidden="true" /></Link>
          </Surface>
        </section>

        <Surface className={styles.eventJournal}>
          <div className={styles.sectionHeader}>
            <div><span>ЖУРНАЛ СОБЫТИЙ</span><h2>Последние изменения потока</h2></div>
            <Link to="/parts">Все события <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className={styles.eventRows}>
            {shiftEvents.map((event) => (
              <div className={styles.eventRow} key={`${event.time}-${event.object}`}>
                <time>{event.time}</time>
                <i className={toneClass[event.tone]} aria-label={event.tone} />
                <strong>{event.object}</strong>
                <span>{event.message}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <aside className={styles.actionRail} aria-label="Контекст смены">
        <Surface tone={actionDone ? "success" : "warning"} className={styles.nextAction} aria-live="polite">
          <div className={styles.railTop}>
            <span>{actionDone ? "ДЕЙСТВИЕ ЗАКРЫТО" : "СЛЕДУЮЩЕЕ ДЕЙСТВИЕ"}</span>
            <div className={styles.railIcon}>{actionDone ? <CheckCircle2 aria-hidden="true" /> : <PackageOpen aria-hidden="true" />}</div>
          </div>
          <h2>{actionDone ? "Тара освобождена" : "Освободить тару годных деталей"}</h2>
          <p>{actionDone ? "Весы подтвердили свободную тару. A4 вернётся в поток автоматически." : "Стеллаж A · заполнение 92%. Выполнить в ближайшие 30 минут."}</p>
          <button type="button" onClick={() => setActionDone((done) => !done)}>
            {actionDone ? "Вернуть в работу" : "Я выполнил"}<Check aria-hidden="true" />
          </button>
        </Surface>

        <Surface tone="danger" className={styles.incidentCard}>
          <div className={styles.railTop}>
            <span>ТРЕБУЕТ ВНИМАНИЯ</span>
            <div className={styles.railIcon}><ShieldAlert aria-hidden="true" /></div>
          </div>
          <h2>Сбой экструзии · D3</h2>
          <p>Слой 142 / 210 · обнаружен в 02:22. Печать безопасно остановлена.</p>
          <Link to="/incidents">Открыть инцидент <ArrowUpRight aria-hidden="true" /></Link>
        </Surface>

        <Surface tone="dark" className={styles.nightCard}>
          <div className={styles.railTop}>
            <span>ГОТОВНОСТЬ К НОЧИ</span>
            <div className={styles.nightScore}><DottedNumber compact>4/5</DottedNumber></div>
          </div>
          <h2>Почти готова</h2>
          <div className={styles.nightChecklist}>
            <span><CheckCircle2 aria-hidden="true" />Освещение и пожарная цепь</span>
            <span><CheckCircle2 aria-hidden="true" />Температура и вентиляция</span>
            <span><CheckCircle2 aria-hidden="true" />Резервные материалы</span>
            <span className={styles.nightWait}><AlertTriangle aria-hidden="true" />Тара стеллажа A</span>
          </div>
          <Link to="/night">Проверить протокол <ArrowUpRight aria-hidden="true" /></Link>
        </Surface>
      </aside>
    </div>
  );
}
