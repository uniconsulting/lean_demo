import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleStop,
  Clock3,
  Database,
  Eye,
  FileBox,
  History,
  Pause,
  Printer,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Thermometer,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { Surface } from "../../components/ui/Surface";
import { incidentEvents, incidents, type IncidentStatus } from "../../data/incidents";
import styles from "./IncidentsPage.module.css";

type Filter = "waiting" | "critical" | "abs" | "rejected" | "saved";
type Outcome = "defect" | "false-positive" | "cancel" | null;

const filters: { id: Filter; label: string }[] = [
  { id: "waiting", label: "Ждут человека · 1" },
  { id: "critical", label: "Критичные" },
  { id: "abs", label: "ABS / ASA" },
  { id: "rejected", label: "Опровергнутые" },
  { id: "saved", label: "Датасет сохранён" },
];

const statusTone: Record<IncidentStatus, string> = { waiting: "warning", actioned: "danger", saved: "success" };

export default function IncidentsPage() {
  const [filter, setFilter] = useState<Filter>("waiting");
  const [selectedId, setSelectedId] = useState("INC-148");
  const [frame, setFrame] = useState(1);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [resolvedAs, setResolvedAs] = useState<Exclude<Outcome, null> | null>(null);
  const [taskCreated, setTaskCreated] = useState(false);

  const selected = useMemo(() => incidents.find((item) => item.id === selectedId) ?? incidents[0], [selectedId]);
  const waiting = selected.status === "waiting" && !resolvedAs;

  function selectIncident(id: string) {
    setSelectedId(id);
    setResolvedAs(null);
    setTaskCreated(false);
    setFrame(1);
  }

  function completeOutcome(next: Exclude<Outcome, null>) {
    setResolvedAs(next);
    setOutcome(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroHeader}><div><h1>Не сигнал, а понятное решение</h1><p>Кадры, телеметрия, VLM и политика материала соединены в один проверяемый andon-процесс.</p></div><div className={styles.shiftStats}><article><strong>1</strong><span>ждёт человека</span></article><article><strong>12</strong><span>за смену</span></article></div></div>
          <div className={styles.filters} role="tablist" aria-label="Фильтры инцидентов">{filters.map((item) => <button className={filter === item.id ? styles.filterActive : ""} role="tab" aria-selected={filter === item.id} type="button" onClick={() => setFilter(item.id)} key={item.id}>{item.label}</button>)}</div>
        </Surface>

        <Surface className={styles.investigation}>
          <aside className={styles.incidentLane}>
            <div className={styles.laneHeader}><div><AlertTriangle aria-hidden="true" /><h2>Инциденты</h2></div><span>{filter === "waiting" ? "1 открыт" : "3 события"}</span></div>
            <div className={styles.incidentList}>{incidents.map((incident) => <button className={`${styles.incidentRow} ${selected.id === incident.id ? styles.incidentSelected : ""}`} type="button" aria-pressed={selected.id === incident.id} onClick={() => selectIncident(incident.id)} key={incident.id}><span className={`${styles.statusIcon} ${styles[`tone_${statusTone[incident.status]}`]}`}>{incident.status === "waiting" ? <Clock3 /> : incident.status === "actioned" ? <CircleStop /> : <Check />}</span><div><strong>{incident.id} · {incident.printer}</strong><span>{incident.product}</span><small>{incident.material} · печать {incident.progress}%</small></div><time>{incident.at}</time></button>)}</div>
            <div className={styles.laneFoot}><Database aria-hidden="true" /><span><strong>Каждый исход — данные</strong>Подтверждения и опровержения сохраняются отдельно.</span></div>
          </aside>

          <section className={styles.evidencePanel}>
            <div className={styles.sectionHeader}><div><Camera aria-hidden="true" /><span><strong>{selected.id} · {selected.printer}</strong><small>{selected.product} · {selected.material} · печать {selected.progress}%</small></span></div><b className={styles[`tone_${selected.tone}`]}>{waiting ? "waiting_human" : resolvedAs ? "outcome saved" : selected.statusLabel}</b></div>
            <div className={`${styles.evidenceFrame} ${styles[`frame_${frame}`]}`}><img src={`${import.meta.env.BASE_URL}assets/farm-print-camera-v1.webp`} alt={`Кадр инцидента ${selected.id}`} /><div className={styles.focusZone} aria-hidden="true"><span /></div><div className={styles.frameMeta}><span><ScanLine aria-hidden="true" />CV EVIDENCE</span><time>{selected.at}:0{frame + 2}</time></div></div>
            <div className={styles.frameStrip} aria-label="Кадры инцидента">{[0, 1, 2].map((index) => <button className={frame === index ? styles.frameActive : ""} type="button" aria-label={`Кадр ${index + 1}`} aria-pressed={frame === index} onClick={() => setFrame(index)} key={index}><img src={`${import.meta.env.BASE_URL}assets/farm-print-camera-v1.webp`} alt="" /><span>0{index + 1}</span></button>)}</div>
            <dl className={styles.telemetry}><div><dt><Eye aria-hidden="true" />Источник</dt><dd>{selected.signal} / {selected.confidence}</dd></div><div><dt><Thermometer aria-hidden="true" />Телеметрия</dt><dd>сопло 245° · стол 100°</dd></div><div><dt><FileBox aria-hidden="true" />Кадры</dt><dd>3 / 3 доступны</dd></div></dl>
          </section>

          <section className={styles.decisionPanel}>
            <div className={styles.sectionHeader}><div><Bot aria-hidden="true" /><span><strong>Решение системы</strong><small>Qwen2.5-VL · {selected.at}</small></span></div></div>
            <div className={styles.verdict}><div><Sparkles aria-hidden="true" /><span>VLM confidence</span><strong><DottedNumber compact>0,81</DottedNumber></strong></div><h2>{selected.verdict}</h2><p>{selected.reason}</p></div>
            <div className={styles.policy}><div><ShieldCheck aria-hidden="true" /><span><strong>Политика реакции</strong><small>Правило сильнее model verdict</small></span></div><p>{selected.policy}</p>{selected.material === "ABS" ? <b><AlertTriangle aria-hidden="true" />ABS / ASA: только алерт</b> : null}</div>
            <div className={styles.precedence}><span>01 · CV</span><ChevronRight /><span>02 · VLM</span><ChevronRight /><strong>03 · RULE</strong><ChevronRight /><span>04 · HUMAN</span></div>
          </section>
        </Surface>

        <Surface className={styles.historySurface}>
          <div className={styles.sectionHeader}><div><History aria-hidden="true" /><span><strong>История решения</strong><small>Почему система пришла к текущему состоянию</small></span></div><Link to="/parts">Открыть журнал <ArrowUpRight /></Link></div>
          <div className={styles.timeline}>{resolvedAs ? <article className={styles.outcomeEvent}><time>сейчас</time><i><UserCheck /></i><div><strong>{resolvedAs === "defect" ? "Оператор подтвердил дефект" : resolvedAs === "false-positive" ? "Вердикт помечен как false positive" : "Оператор подтвердил cancel"}</strong><span>outcome сохранён в аудит и датасет</span></div><b>HUMAN</b></article> : null}{incidentEvents.map((event) => <article key={`${event.at}-${event.source}`}><time>{event.at}</time><i>{event.source === "VLM" ? <Bot /> : event.source === "CV" ? <Eye /> : <ShieldCheck />}</i><div><strong>{event.title}</strong><span>{event.detail}</span></div><b>{event.source}</b></article>)}</div>
        </Surface>
      </div>

      <aside className={styles.rail}>
        <Surface tone={waiting ? "warning" : "success"} className={styles.actionCard}>
          <div className={styles.actionTop}><span>{waiting ? "НУЖНО РЕШЕНИЕ ЧЕЛОВЕКА" : "ИСХОД ЗАПИСАН"}</span>{waiting ? <UserCheck /> : <CheckCircle2 />}</div>
          <h2>{waiting ? "Определить исход INC-148" : resolvedAs === "false-positive" ? "Ложное срабатывание сохранено" : resolvedAs === "cancel" ? "Cancel подтверждён" : "Дефект подтверждён"}</h2>
          <p>{waiting ? "Печать продолжается. Автоматическая пауза ABS запрещена политикой материала." : "Решение появилось в истории, журнале и контуре подготовки датасета."}</p>
          {waiting ? <div className={styles.outcomeActions}><button type="button" onClick={() => setOutcome("defect")}><CheckCircle2 />Подтвердить дефект</button><button type="button" onClick={() => setOutcome("false-positive")}><Eye />Ложное срабатывание</button><button className={styles.cancelAction} type="button" onClick={() => setOutcome("cancel")}><CircleStop />Подтвердить cancel</button></div> : <button className={styles.reopenButton} type="button" onClick={() => setResolvedAs(null)}>Вернуть к разбору</button>}
        </Surface>

        <Surface className={styles.consequencesCard}><div className={styles.sectionHeader}><div><ShieldCheck /><span><strong>Что изменит исход</strong><small>аудитируемые последствия</small></span></div></div><div className={styles.consequenceList}><article><CheckCircle2 /><span><strong>Подтвердить дефект</strong><small>задача + датасет defect</small></span></article><article><Eye /><span><strong>Опровергнуть</strong><small>false positive + continue</small></span></article><article><CircleStop /><span><strong>Cancel</strong><small>только human confirmation</small></span></article></div></Surface>

        <Surface className={styles.relatedCard}><div className={styles.sectionHeader}><div><Printer /><span><strong>Связанные объекты</strong><small>полный производственный контекст</small></span></div></div><Link to={`/printers/${selected.printer}`}>{selected.printer}<ArrowUpRight /></Link><Link to="/queue">Задание #041<ArrowUpRight /></Link><Link to="/products">{selected.product}<ArrowUpRight /></Link><button type="button" onClick={() => setTaskCreated(true)} disabled={taskCreated}><Wrench />{taskCreated ? "Задача ТО-184 создана" : "Создать задачу обслуживания"}{taskCreated ? <Check /> : <ArrowUpRight />}</button></Surface>
      </aside>

      {outcome ? createPortal(<div className={styles.dialogBackdrop} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="incident-dialog-title"><button className={styles.dialogClose} type="button" onClick={() => setOutcome(null)} aria-label="Закрыть"><X /></button><div className={`${styles.dialogIcon} ${outcome === "cancel" ? styles.dialogDanger : ""}`}>{outcome === "defect" ? <CheckCircle2 /> : outcome === "false-positive" ? <Eye /> : <Pause />}</div><span>{outcome === "cancel" ? "DESTRUCTIVE OUTCOME" : "HUMAN OUTCOME"}</span><h2 id="incident-dialog-title">{outcome === "defect" ? "Подтвердить дефект?" : outcome === "false-positive" ? "Отметить false positive?" : "Подтвердить cancel печати?"}</h2><p>{outcome === "cancel" ? "В реальном контуре команда потребует роль и будет отправлена через Edge. В прототипе оборудование не затрагивается." : "Решение будет записано в аудит и использовано как размеченный исход для будущего датасета."}</p><div className={styles.dialogActions}><button type="button" onClick={() => setOutcome(null)}>Отмена</button><button className={outcome === "cancel" ? styles.confirmDanger : ""} type="button" onClick={() => completeOutcome(outcome)}>{outcome === "defect" ? "Подтвердить дефект" : outcome === "false-positive" ? "Сохранить опровержение" : "Подтвердить mock-cancel"}</button></div></section></div>, document.body) : null}
    </div>
  );
}
