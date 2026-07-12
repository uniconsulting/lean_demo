import { useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, ArrowUpRight, CalendarClock, Camera, Check, CheckCircle2, ChevronRight,
  CirclePause, Filter, History, LockKeyhole, MoonStar, PackageOpen, Plus,
  RotateCcw, Scale, ShieldCheck, UserCheck, Wrench, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { Surface } from "../../components/ui/Surface";
import { operatorTasks, type TaskKind, type TaskStatus } from "../../data/operatorTasks";
import styles from "./OperatorTasksPage.module.css";

type FilterId = "open" | TaskKind | "overdue";
type DialogId = "postpone" | "create" | null;

const filters: { id: FilterId; label: string }[] = [
  { id: "open", label: "Открытые · 5" }, { id: "night", label: "Блокируют ночь · 2" },
  { id: "incident", label: "Инциденты" }, { id: "maintenance", label: "Регламент" },
  { id: "overdue", label: "Просроченные · 1" },
];
const statusLabel: Record<TaskStatus, string> = { new: "новая", assigned: "назначена", in_progress: "в работе", blocked: "заблокирована", done: "выполнена", overdue: "просрочена" };

export default function OperatorTasksPage() {
  const [filter, setFilter] = useState<FilterId>("open");
  const [selectedId, setSelectedId] = useState("TASK-184");
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>({});
  const [checks, setChecks] = useState<Record<string, boolean[]>>({});
  const [sensorPending, setSensorPending] = useState(false);
  const [dialog, setDialog] = useState<DialogId>(null);
  const [reason, setReason] = useState("");
  const [manualCount, setManualCount] = useState(0);

  const visibleTasks = useMemo(() => operatorTasks.filter((task) => {
    const current = statuses[task.id] ?? task.status;
    if (filter === "open") return current !== "done";
    if (filter === "overdue") return current === "overdue";
    return task.kind === filter;
  }), [filter, statuses]);
  const selected = operatorTasks.find((task) => task.id === selectedId) ?? operatorTasks[0];
  const status = statuses[selected.id] ?? selected.status;
  const taskChecks = checks[selected.id] ?? selected.checklist.map(() => false);
  const checkedCount = taskChecks.filter(Boolean).length;
  const allChecked = checkedCount === taskChecks.length;

  function chooseTask(id: string) { setSelectedId(id); setSensorPending(false); }
  function toggleStep(index: number) {
    setChecks((current) => ({ ...current, [selected.id]: taskChecks.map((value, stepIndex) => stepIndex === index ? !value : value) }));
    setSensorPending(false);
  }
  function confirmSensor() { setStatuses((current) => ({ ...current, [selected.id]: "done" })); setSensorPending(false); }
  function saveDialog() {
    if (!reason.trim()) return;
    if (dialog === "create") setManualCount((count) => count + 1);
    else setStatuses((current) => ({ ...current, [selected.id]: "blocked" }));
    setDialog(null); setReason("");
  }

  return <div className={styles.page}>
    <div className={styles.mainColumn}>
      <Surface className={styles.hero}>
        <div className={styles.heroTop}><div><h1>Дела, которые разблокируют поток</h1><p>Один список вместо обхода фермы: физический объект, причина, действие и проверяемый результат.</p></div><div className={styles.heroStats}><article><strong>5</strong><span>открытых</span></article><article><strong>2</strong><span>блокируют ночь</span></article></div></div>
        <div className={styles.filterRow}><div className={styles.filters} role="tablist" aria-label="Фильтры задач">{filters.map((item) => <button className={filter === item.id ? styles.filterActive : ""} role="tab" aria-selected={filter === item.id} type="button" onClick={() => setFilter(item.id)} key={item.id}>{item.label}</button>)}</div><button className={styles.createButton} type="button" onClick={() => setDialog("create")}><Plus />Создать вручную</button></div>
      </Surface>

      <Surface className={styles.workspace}>
        <aside className={styles.taskLane}><div className={styles.laneHeader}><span><Filter /><strong>Приоритет смены</strong></span><small>по влиянию на поток</small></div><div className={styles.taskList}>{visibleTasks.map((task, index) => {
          const current = statuses[task.id] ?? task.status;
          return <button className={`${styles.taskRow} ${selected.id === task.id ? styles.taskSelected : ""}`} type="button" aria-pressed={selected.id === task.id} onClick={() => chooseTask(task.id)} key={task.id}><span className={`${styles.priority} ${styles[`priority_${task.kind}`]}`}>{String(index + 1).padStart(2, "0")}</span><span className={styles.taskCopy}><span><strong>{task.title}</strong><time>{task.due}</time></span><small>{task.object} · {task.location}</small><em>{current === "overdue" ? "Просрочена · " : ""}{task.unlocks}</em></span><ChevronRight /></button>;
        })}</div><div className={styles.laneFoot}>Приоритет строится по разблокировке производства, а не по времени уведомления.</div>{manualCount ? <div className={styles.createdNotice}><Check />TASK-{190 + manualCount} добавлена</div> : null}</aside>

        <section className={styles.detail}>
          <img className={styles.objectImage} src={`${import.meta.env.BASE_URL}assets/operator-task-bin-v1.png`} alt="Тара с готовыми деталями на стойке A" />
          <div className={styles.detailWash} aria-hidden="true" />
          <div className={styles.detailHead}><div><span className={styles.kindBadge}>{selected.kind === "night" ? <MoonStar /> : selected.kind === "incident" ? <AlertTriangle /> : <Wrench />}{selected.kind === "night" ? "Блокирует ночной запуск" : statusLabel[status]}</span><h2>{selected.title}</h2><p>{selected.id} · {selected.object} · {selected.location}</p></div><time><CalendarClock /><span>SLA</span><strong>{selected.due}</strong></time></div>
          <div className={styles.liveLabel}><Camera />LIVE OBJECT · {selected.location}</div>
          <dl className={styles.facts}><div><dt>Физический объект</dt><dd>{selected.object} · {selected.location}</dd></div><div><dt>Почему возникла</dt><dd>{selected.reason}</dd></div><div><dt>Система подтвердит</dt><dd>{selected.sensor}</dd></div></dl>
          <div className={styles.checkHead}><strong>Что нужно сделать</strong><span>{checkedCount} из {taskChecks.length} шагов</span></div>
          <div className={styles.checklist}>{selected.checklist.map((step, index) => <button className={taskChecks[index] ? styles.stepChecked : ""} type="button" aria-pressed={taskChecks[index]} onClick={() => toggleStep(index)} key={step}><i>{taskChecks[index] ? <Check /> : String(index + 1).padStart(2, "0")}</i><span><strong>{step}</strong><small>{index === selected.checklist.length - 1 ? "аппаратный контур" : "подтверждает оператор"}</small></span></button>)}</div>
          <div className={styles.confirmRule}><span><CheckCircle2 />Чек-лист оператора</span><span><Scale />Физический датчик</span></div>
        </section>
      </Surface>

      <Surface className={styles.historyCard}><div className={styles.cardHead}><div><History /><span><strong>История выполнения</strong><small>аудит назначений и подтверждений</small></span></div><Link to="/parts">Открыть журнал <ArrowUpRight /></Link></div><div className={styles.events}><article><time>14:26</time><i><UserCheck /></i><span><strong>Задача назначена Анне</strong><small>диспетчер смены · автоматически</small></span></article><article><time>14:18</time><i><Scale /></i><span><strong>Весы A-17: заполнение 92%</strong><small>Edge создал TASK-184</small></span></article></div></Surface>
    </div>

    <aside className={styles.rail}>
      <Surface className={`${styles.actionCard} ${status === "done" ? styles.actionDone : ""}`}>
        <div className={styles.actionTop}><span>{status === "done" ? "ЗАДАЧА ЗАКРЫТА" : status === "in_progress" ? "ЗАДАЧА В РАБОТЕ" : "СЛЕДУЮЩЕЕ ДЕЙСТВИЕ"}</span>{status === "done" ? <CheckCircle2 /> : <PackageOpen />}</div><h2>{status === "done" ? "Результат подтверждён" : status === "in_progress" ? selected.title : `Взять ${selected.id} в работу`}</h2><p>{status === "done" ? `${selected.sensor}. Поток пересчитан автоматически.` : `Ответственная: ${selected.assignee ?? "не назначена"}. После чек-листа потребуется hardware-подтверждение.`}</p>
        {sensorPending ? <div className={styles.sensorBox}><Scale /><span><strong>Ожидается датчик</strong><small>{selected.sensor}</small></span><button type="button" onClick={confirmSensor}>Подтвердить mock-датчик</button></div> : null}
        <div className={styles.actionButtons}>{status === "done" ? <button type="button" onClick={() => setStatuses((current) => ({ ...current, [selected.id]: "in_progress" }))}><RotateCcw />Вернуть в работу</button> : status === "in_progress" ? <button type="button" disabled={!allChecked} onClick={() => setSensorPending(true)}><Check />Завершить задачу</button> : <button type="button" onClick={() => setStatuses((current) => ({ ...current, [selected.id]: "in_progress" }))}><UserCheck />Взять в работу</button>}<button type="button" onClick={() => setDialog("postpone")}><CirclePause />Отложить с причиной</button></div>
      </Surface>
      <Surface className={styles.unlockCard}><div className={styles.cardHead}><div><LockKeyhole /><span><strong>Разблокирует</strong><small>после подтверждения</small></span></div></div><div className={styles.unlockMetric}><DottedNumber compact>{selected.impact}</DottedNumber><span>{selected.impact === 1 ? "объект" : "принтеров"}</span></div><p>{selected.unlocks}</p><div className={styles.progress}><i style={{ "--progress": status === "done" ? "100%" : "76%" } as CSSProperties} /></div><small>{status === "done" ? "блокер снят" : "готовность ночи 76%"}</small></Surface>
      <Surface className={styles.ruleCard}><div className={styles.cardHead}><div><ShieldCheck /><span><strong>Правило закрытия</strong><small>два канала подтверждения</small></span></div></div><article><CheckCircle2 /><span><strong>Чек-лист оператора</strong><small>{checkedCount} / {taskChecks.length}</small></span></article><article><Scale /><span><strong>Физический датчик</strong><small>{status === "done" ? "подтверждено" : "ожидается"}</small></span></article></Surface>
    </aside>

    {dialog ? createPortal(<div className={styles.dialogBackdrop} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="task-dialog-title"><button className={styles.dialogClose} type="button" onClick={() => setDialog(null)} aria-label="Закрыть"><X /></button><div className={styles.dialogIcon}>{dialog === "create" ? <Plus /> : <CirclePause />}</div><span>OPERATOR TASK</span><h2 id="task-dialog-title">{dialog === "create" ? "Создать задачу вручную" : "Почему задача откладывается?"}</h2><p>{dialog === "create" ? "Локальная mock-задача без команд оборудованию." : "Причина останется в истории смены."}</p><label>{dialog === "create" ? "Что нужно сделать" : "Причина"}<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder={dialog === "create" ? "Например: проверить сопло K1C-03" : "Например: ожидаю резервную катушку"} /></label><div className={styles.dialogActions}><button type="button" onClick={() => setDialog(null)}>Отмена</button><button type="button" disabled={!reason.trim()} onClick={saveDialog}>{dialog === "create" ? "Создать mock-задачу" : "Отложить"}</button></div></section></div>, document.body) : null}
  </div>;
}
