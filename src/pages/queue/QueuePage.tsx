import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowUpRight,
  Ban,
  Check,
  CirclePlus,
  GripVertical,
  Layers3,
  Minus,
  Moon,
  Plus,
  RadioTower,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { LiveDot } from "../../components/ui/LiveDot";
import { Surface } from "../../components/ui/Surface";
import { dispatchFactors, initialQueueJobs, reorderQueue, type QueueJob } from "../../data/queue";
import styles from "./QueuePage.module.css";

type DialogState = "create" | "cancel" | null;

function QueueRow({ job, selected, onSelect }: { job: QueueJob; selected: boolean; onSelect: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });
  return (
    <article
      ref={setNodeRef}
      className={`${styles.queueRow} ${styles[job.tone]} ${selected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      aria-label={`${job.position}. ${job.product}, ${job.state}`}
    >
      <button className={styles.dragHandle} type="button" aria-label={`Переместить ${job.product}`} {...attributes} {...listeners}><GripVertical aria-hidden="true" /></button>
      <button className={styles.rowSelect} type="button" onClick={() => onSelect(job.id)} aria-pressed={selected} aria-label={`Открыть ${job.product}`}>
        <DottedNumber compact>{String(job.position).padStart(2, "0")}</DottedNumber>
        <div className={styles.jobIdentity}><strong>{job.product} · серия {job.quantity} шт.</strong><span>{job.material} · #{job.id}</span></div>
        <div className={styles.jobFact}><strong>{job.duration}</strong><span>{job.durationNote}</span></div>
        <div className={styles.jobFact}><strong>{job.assignment}</strong><span>{job.assignmentNote}</span></div>
        <b className={styles.stateTag}>{job.state}</b>
      </button>
    </article>
  );
}

export default function QueuePage() {
  const [jobs, setJobs] = useState(initialQueueJobs);
  const [selectedId, setSelectedId] = useState("024");
  const [quantity, setQuantity] = useState(40);
  const [nightIncluded, setNightIncluded] = useState(true);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [created, setCreated] = useState(false);
  const selected = useMemo(() => jobs.find((job) => job.id === selectedId) ?? jobs[0], [jobs, selectedId]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setJobs((current) => reorderQueue(current, String(active.id), String(over.id)));
  }

  function selectJob(id: string) {
    const job = jobs.find((item) => item.id === id);
    if (!job) return;
    setSelectedId(id);
    setQuantity(job.quantity);
    setNightIncluded(job.nightAllowed);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroHeader}>
            <button className={styles.createButton} type="button" onClick={() => setDialog("create")}><CirclePlus aria-hidden="true" />Создать серию</button>
          </div>
          <div className={styles.coverageGrid}>
            <div className={styles.coverageCard}>
              <div><span>ПОКРЫТИЕ НОЧИ</span><small>цель · 12 ч</small></div>
              <strong><DottedNumber>18 ч 40 мин</DottedNumber></strong>
              <div className={styles.coverageAxis} aria-label="Покрытие ночи с запасом 6 часов 40 минут">{Array.from({ length: 12 }, (_, index) => <i className={index < 9 ? styles.axisCovered : ""} key={index} />)}</div>
            </div>
            <div className={styles.coverageMetric}><DottedNumber compact>4</DottedNumber><strong>Выполняется</strong><span>назначены</span></div>
            <div className={styles.coverageMetric}><DottedNumber compact>3</DottedNumber><strong>Следующие</strong><span>совместимы</span></div>
            <div className={`${styles.coverageMetric} ${styles.metricWarning}`}><DottedNumber compact>1</DottedNumber><strong>Блокер</strong><span>материал</span></div>
            <div className={styles.edgeMirror}><RadioTower aria-hidden="true" /><strong>Edge mirror</strong><span><LiveDot />актуален · 14:26</span></div>
          </div>
        </Surface>

        <Surface className={styles.queueSurface}>
          <div className={styles.sectionHeader}><div><h2>Порядок выполнения</h2><p>Перемещение проверяет совместимость до синхронизации с Edge.</p></div><span><RefreshCcw aria-hidden="true" />last sync · 14:26</span></div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={jobs.map((job) => job.id)} strategy={verticalListSortingStrategy}>
              <div className={styles.queueLane}>
                {jobs.map((job) => <QueueRow key={job.id} job={job} selected={selectedId === job.id} onSelect={selectJob} />)}
              </div>
            </SortableContext>
          </DndContext>
        </Surface>

        <Surface className={styles.explainSurface}>
          <div className={styles.logicPanel}><h2>Почему такой порядок</h2><div>{dispatchFactors.map((factor) => <article key={factor.label}><span>{factor.label}</span><strong>{factor.value}</strong></article>)}</div></div>
          <div className={styles.blockerPanel}><div><Ban aria-hidden="true" /><span>МАТЕРИАЛ БЛОКИРУЕТ #057</span></div><h2>Заменить катушку #17 у K1C-06</h2><p>После замены серия добавит ещё 3 ч 20 мин покрытия ночи.</p><Link to="/printers/K1C-06">Открыть K1C-06 <ArrowUpRight aria-hidden="true" /></Link></div>
        </Surface>
      </div>

      <aside className={styles.rail}>
        <Surface className={styles.detailCard}>
          <div className={styles.detailHeader}><div><span>ВЫБРАНА СЕРИЯ</span><h2>{selected.product} {selected.version}</h2></div><b>#{selected.id}</b></div>
          <dl className={styles.detailFacts}><div><dt>Профиль</dt><dd>{selected.profile}</dd></div><div><dt>Артефакт</dt><dd>{selected.artifact}</dd></div><div><dt>Автономия</dt><dd>{selected.nightAllowed ? "допущено" : "не допущено"}</dd></div></dl>
          <div className={styles.quantity}><span>Количество</span><div><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Уменьшить количество"><Minus aria-hidden="true" /></button><DottedNumber compact>{quantity}</DottedNumber><button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Увеличить количество"><Plus aria-hidden="true" /></button></div></div>
          <div className={styles.compatibility}><span>СОВМЕСТИМЫЕ ПРИНТЕРЫ</span><div>{selected.compatible.map((printer) => <Link key={printer} to={`/printers/${printer}`}>{printer}</Link>)}</div></div>
          <div className={styles.detailActions}><Link to="/products">Открыть изделие <ArrowUpRight aria-hidden="true" /></Link><button type="button" onClick={() => setNightIncluded((current) => !current)}><Moon aria-hidden="true" />{nightIncluded ? "Исключить из ночи" : "Вернуть в ночь"}{nightIncluded ? null : <Check aria-hidden="true" />}</button><button className={styles.cancelButton} type="button" onClick={() => setDialog("cancel")}><Trash2 aria-hidden="true" />Отменить задание</button></div>
        </Surface>
        <Surface className={styles.policyCard}><ShieldCheck aria-hidden="true" /><div><h3>Политика ночной смены</h3><p>Если центр недоступен, Edge допечатает зеркальную очередь. Новые старты не теряют локальный safety-контур.</p></div></Surface>
      </aside>

      {dialog ? createPortal((
        <div className={styles.dialogBackdrop} role="presentation" onMouseDown={() => setDialog(null)}>
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="queue-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.dialogClose} type="button" onClick={() => setDialog(null)} aria-label="Закрыть"><X aria-hidden="true" /></button>
            <div className={dialog === "cancel" ? styles.dialogDanger : styles.dialogInfo}>{dialog === "cancel" ? <Trash2 aria-hidden="true" /> : <Layers3 aria-hidden="true" />}</div>
            <span>{dialog === "cancel" ? "ДЕСТРУКТИВНОЕ ДЕЙСТВИЕ" : "НОВАЯ СЕРИЯ"}</span>
            <h2 id="queue-dialog-title">{dialog === "cancel" ? `Отменить задание #${selected.id}?` : created ? "Серия создана" : "Создать серию из изделия"}</h2>
            <p>{dialog === "cancel" ? "Отмена удалит задание из зеркала Edge после синхронизации и будет записана в аудит." : created ? "Черновик #062 добавлен после проверки профиля и ночного допуска." : "В прототипе создаётся локальный черновик. Реальный запуск оборудования не выполняется."}</p>
            <div className={styles.dialogActions}><button type="button" onClick={() => setDialog(null)}>Закрыть</button><button className={dialog === "cancel" ? styles.confirmDanger : ""} type="button" onClick={() => { if (dialog === "create") setCreated(true); else setDialog(null); }}>{dialog === "cancel" ? "Подтвердить отмену" : created ? "Готово" : "Создать черновик"}</button></div>
          </section>
        </div>
      ), document.body) : null}
    </div>
  );
}
