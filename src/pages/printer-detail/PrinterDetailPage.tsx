import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  Check,
  CircleGauge,
  Clock3,
  Disc3,
  FileBox,
  Gauge,
  History,
  Pause,
  RadioTower,
  RefreshCcw,
  ScanLine,
  ShieldCheck,
  Square,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { LiveDot } from "../../components/ui/LiveDot";
import { Modal } from "../../components/ui/Modal";
import { SingleLineText } from "../../components/ui/SingleLineText";
import { Surface } from "../../components/ui/Surface";
import { fsmStages, getPrinterDetail } from "../../data/printerDetail";
import styles from "./PrinterDetailPage.module.css";

type DialogState = "pause" | "spool" | null;

export default function PrinterDetailPage() {
  const { printerId } = useParams();
  const printer = getPrinterDetail(printerId);
  const [liveCamera, setLiveCamera] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const activeStage = actionComplete ? "idle" : printer.stage;
  const activeIndex = fsmStages.findIndex((stage) => stage.id === activeStage);
  const heroDescription = actionComplete ? "Тара подтверждена пустой. K1C-04 вернётся в поток автоматически." : printer.description;

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <header className={styles.heroHeader}>
            <div>
              <div className={styles.eyebrow}><LiveDot />{printer.rack} · {printer.mode}</div>
              <h1>{printer.id}</h1>
              <strong>{actionComplete ? "Цикл разблокирован" : printer.headline}</strong>
              <SingleLineText as="p" text={heroDescription} />
            </div>
            <div className={`${styles.statePill} ${actionComplete ? styles.stateReady : styles.stateWaiting}`}>
              {actionComplete ? <Check aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
              {actionComplete ? "готов к циклу" : "waiting_human"}
            </div>
          </header>

          <div className={styles.fsm} aria-label={`Текущее состояние FSM: ${activeStage}`}>
            {fsmStages.map((stage, index) => (
              <div className={`${styles.fsmStep} ${index < activeIndex ? styles.fsmDone : ""} ${index === activeIndex ? styles.fsmCurrent : ""}`} key={stage.id}>
                <span>{index < activeIndex ? <Check aria-hidden="true" /> : index + 1}</span>
                <small>{stage.label}</small>
              </div>
            ))}
          </div>
        </Surface>

        <div className={styles.objectGrid}>
          <Surface className={styles.cameraSurface}>
            <div className={styles.sectionHeader}>
              <div><Camera aria-hidden="true" /><strong>{liveCamera ? "Live-камера" : "Последний кадр"}</strong></div>
              <button type="button" onClick={() => setLiveCamera((current) => !current)}>
                <ScanLine aria-hidden="true" />{liveCamera ? "Остановить live" : "Открыть live"}
              </button>
            </div>
            <div className={`${styles.cameraFrame} ${liveCamera ? styles.cameraLive : ""}`}>
              <img src={`${import.meta.env.BASE_URL}assets/farm-print-camera-v1.webp`} alt={`Кадр печати ${printer.id}`} />
              <div className={styles.cameraMeta}>
                <span>{liveCamera ? "LIVE" : "LAST FRAME"}</span>
                <time>{liveCamera ? "сейчас" : printer.cameraAt}</time>
              </div>
              <div className={styles.cameraScan} aria-hidden="true" />
            </div>
            <div className={styles.sourceNote}><ShieldCheck aria-hidden="true" /><span><strong>Источник статуса: hardware</strong><SingleLineText text="ИК и весы подтверждают деталь в таре; цикл удерживает Edge." /></span></div>
          </Surface>

          <div className={styles.detailStack}>
            <Surface className={styles.telemetrySurface}>
              <div className={styles.sectionHeader}><div><Gauge aria-hidden="true" /><strong>Телеметрия</strong></div><Link to="/parts" aria-label="Открыть журнал деталей"><History aria-hidden="true" /></Link></div>
              <div className={styles.telemetryGrid}>
                {printer.telemetry.map((metric) => (
                  <div className={`${styles.telemetryItem} ${styles[metric.tone]}`} key={metric.label}>
                    <span>{metric.label}</span>
                    <div className={styles.metricValue}><DottedNumber compact>{metric.value}</DottedNumber>{metric.unit ? <b>{metric.unit}</b> : null}</div>
                    <SingleLineText as="small" text={metric.detail} />
                  </div>
                ))}
              </div>
            </Surface>

            <Surface className={styles.jobSurface}>
              <div className={styles.sectionHeader}><div><FileBox aria-hidden="true" /><strong>Текущее задание</strong></div><Link to="/queue"><ArrowUpRight aria-hidden="true" /></Link></div>
              <div className={styles.productObject}>
                <img src={`${import.meta.env.BASE_URL}assets/selected-product.svg`} alt="Схема втулки направляющей" />
                <div><SingleLineText as="strong" text={printer.job.name} /><SingleLineText text={printer.job.material} /><SingleLineText as="small" text={`${printer.job.series} · ${printer.job.artifact}`} /></div>
              </div>
              <div className={styles.jobProgress} aria-label="Печать завершена на 100 процентов">
                <div className={styles.jobProgressHead}><span>ПЕЧАТЬ ЗАВЕРШЕНА</span><strong><DottedNumber compact>100</DottedNumber><small>%</small></strong></div>
                <div className={styles.layerTrack} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
                <div className={styles.jobProgressMeta}><span>412 / 412 слоёв</span><span>ожидает снятия</span></div>
              </div>
            </Surface>
          </div>
        </div>

        <section className={styles.cycleContext} aria-label="Контекст цикла">
          <Surface className={styles.contextModule}>
            <div><Disc3 aria-hidden="true" /><span>КАТУШКА</span></div>
            <strong>{printer.spool.remaining}</strong>
            <SingleLineText as="p" text={`${printer.spool.material} · ${printer.spool.id}`} />
            <SingleLineText as="small" text={printer.spool.batch} />
            <button type="button" onClick={() => setDialog("spool")}>Заменить <RefreshCcw aria-hidden="true" /></button>
          </Surface>
          <Surface className={styles.contextModule}>
            <div><Thermometer aria-hidden="true" /><span>ПОВЕРХНОСТЬ / КЛЕЙ</span></div>
            <strong>{printer.surface.cycles}</strong>
            <SingleLineText as="p" text={`${printer.surface.name} · рабочая поверхность`} />
            <SingleLineText as="small" text={printer.surface.note} />
          </Surface>
          <Surface className={`${styles.contextModule} ${styles.syncModule}`}>
            <div><RadioTower aria-hidden="true" /><span>СИНХРОНИЗАЦИЯ</span></div>
            <strong>{printer.sync.state}</strong>
            <SingleLineText as="p" text={printer.sync.detail} />
            <SingleLineText as="small" text="FSM и safety-контур продолжают работу локально." />
          </Surface>
        </section>
      </div>

      <aside className={styles.rail}>
        <Surface className={`${styles.actionCard} ${actionComplete ? styles.actionDone : ""}`}>
          <div className={styles.actionIcon}>{actionComplete ? <Check aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}</div>
          <span>{actionComplete ? "ДЕЙСТВИЕ ЗАКРЫТО" : "СЛЕДУЮЩЕЕ ДЕЙСТВИЕ"}</span>
          <h2>{actionComplete ? "Тара подтверждена пустой" : "Освободить тару годных деталей"}</h2>
          <p>{actionComplete ? <>Поток разблокирован.<br />K1C-04 вернётся в поток автоматически.</> : <>Стеллаж A заполнен на 92%.<br />Выполнить в ближайшие 30 минут.</>}</p>
          <button type="button" onClick={() => setActionComplete((current) => !current)}>
            {actionComplete ? "Вернуть в работу" : "Подтвердить и продолжить"}<Check aria-hidden="true" />
          </button>
        </Surface>

        <Surface className={styles.commandsCard}>
          <div className={`${styles.sectionHeader} ${styles.stackedHeader}`}><div><CircleGauge aria-hidden="true" /><span className={styles.headerCopy}><strong>Разрешённые команды</strong><small>роль: оператор</small></span></div></div>
          <button type="button" onClick={() => setDialog("spool")}><RefreshCcw aria-hidden="true" /><span><strong>Заменить катушку</strong><small>Сверка ID и остатка</small></span><ArrowUpRight aria-hidden="true" /></button>
          <button type="button" onClick={() => setTaskCreated(true)} disabled={taskCreated}><Wrench aria-hidden="true" /><span><strong>{taskCreated ? "Задача создана" : "Создать задачу"}</strong><small>{taskCreated ? "ТО-184 · назначена Анне" : "Обслуживание принтера"}</small></span>{taskCreated ? <Check aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</button>
          <button className={styles.destructiveButton} type="button" onClick={() => setDialog("pause")}><Pause aria-hidden="true" /><span><strong>Пауза / остановка</strong><small>Требуется подтверждение</small></span><ShieldCheck aria-hidden="true" /></button>
        </Surface>

        <Surface className={styles.eventsCard}>
          <div className={styles.sectionHeader}><div><History aria-hidden="true" /><strong>Последние события</strong></div><Link to="/parts"><ArrowUpRight aria-hidden="true" /></Link></div>
          <div className={styles.eventsList}>
            {printer.events.map((event) => <div key={`${event.time}-${event.message}`}><time>{event.time}</time><i className={styles[event.tone]} /><SingleLineText text={event.message} /></div>)}
          </div>
        </Surface>
      </aside>

      {dialog ? (
        <Modal labelledBy="printer-dialog-title" onClose={() => setDialog(null)} className={styles.dialog}>
            <div className={dialog === "pause" ? styles.dialogDangerIcon : styles.dialogInfoIcon}>{dialog === "pause" ? <Square aria-hidden="true" /> : <Disc3 aria-hidden="true" />}</div>
            <span>{dialog === "pause" ? "ДЕСТРУКТИВНАЯ КОМАНДА" : "ЛОКАЛЬНОЕ ДЕЙСТВИЕ"}</span>
            <h2 id="printer-dialog-title">{dialog === "pause" ? "Приостановить K1C-04?" : "Заменить катушку"}</h2>
            <p>{dialog === "pause" ? "Команда будет передана через Edge и записана в аудит. Текущий цикл уже завершён, поэтому штатное подтверждение тары безопаснее." : "Отсканируйте новую катушку и подтвердите фактический вес. Очередь пересчитает доступные серии автоматически."}</p>
            <div className={styles.dialogActions}>
              <button type="button" onClick={() => setDialog(null)}>Отмена</button>
              <button className={dialog === "pause" ? styles.confirmDanger : ""} type="button" onClick={() => setDialog(null)}>{dialog === "pause" ? "Подтвердить паузу" : "Катушка отсканирована"}</button>
            </div>
        </Modal>
      ) : null}
    </div>
  );
}
