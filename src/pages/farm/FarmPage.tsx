import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Factory,
  PackageOpen,
  RadioTower,
  ScanLine,
  Wifi,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { LiveDot } from "../../components/ui/LiveDot";
import { Surface } from "../../components/ui/Surface";
import { PrinterStatusTile } from "../../components/domain/PrinterStatusTile";
import { farmPrinters, farmTotals } from "../../data/farm";
import type { FarmFilter, FarmPrinter, FarmPrinterState } from "../../data/farm";
import styles from "./FarmPage.module.css";

const filters: Array<{ value: FarmFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "autonomous", label: "Автономные" },
  { value: "blockers", label: "Только блокеры" },
  { value: "control", label: "Control-only" },
];

const stateLabel: Record<FarmPrinterState, string> = {
  printing: "Печатает",
  finishing: "Завершает",
  waiting: "Ожидает",
  ready: "Готов",
};

function PrinterTile({ printer, selected, muted, busy, onSelect }: { printer: FarmPrinter; selected: boolean; muted: boolean; busy: boolean; onSelect: (id: string) => void }) {
  return <PrinterStatusTile id={printer.id} status={busy ? "Занят вручную" : stateLabel[printer.state]} tone={printer.state} job={printer.job} material={printer.material} trailing={printer.progress === undefined ? printer.fsm : `${printer.progress}%`} selected={selected} muted={muted} compact={printer.rack === "Control"} onSelect={onSelect} />;
}

function RackSection({ rack, printers, selectedId, filter, busyState, onSelect }: { rack: "A" | "B"; printers: FarmPrinter[]; selectedId: string; filter: FarmFilter; busyState: Record<string, boolean>; onSelect: (id: string) => void }) {
  const hasBlocker = printers.some((printer) => printer.state === "waiting");
  return (
    <section className={styles.rackSection} aria-label={`Стойка ${rack}`}>
      <header>
        <div><LiveDot /><strong>Стойка {rack}</strong><span>автономия</span></div>
        <small>{hasBlocker ? "Тара требует очистки" : "Preflight и пожарная цепь в норме"}</small>
      </header>
      <div className={styles.rackRail}>
        {printers.map((printer) => (
          <PrinterTile
            key={printer.id}
            printer={printer}
            selected={selectedId === printer.id}
            muted={filter === "blockers" && printer.state !== "waiting"}
            busy={Boolean(busyState[printer.id])}
            onSelect={onSelect}
          />
        ))}
        <div className={`${styles.binObject} ${hasBlocker ? styles.binWarning : ""}`} aria-label={hasBlocker ? "Тара годных заполнена" : "Тара годных в норме"}>
          <PackageOpen aria-hidden="true" /><span>Тара годных</span><strong>{hasBlocker ? "92%" : "38%"}</strong>
        </div>
      </div>
    </section>
  );
}

export default function FarmPage() {
  const [filter, setFilter] = useState<FarmFilter>("all");
  const [selectedId, setSelectedId] = useState("K1C-04");
  const [liveCamera, setLiveCamera] = useState(false);
  const [manualBusy, setManualBusy] = useState<Record<string, boolean>>({ "CTRL-01": true });

  const selected = useMemo(() => farmPrinters.find((printer) => printer.id === selectedId) ?? farmPrinters[3], [selectedId]);
  const rackA = farmPrinters.filter((printer) => printer.rack === "A");
  const rackB = farmPrinters.filter((printer) => printer.rack === "B");
  const controlPrinters = farmPrinters.filter((printer) => printer.rack === "Control");
  const showAutonomous = filter !== "control";
  const showControl = filter === "all" || filter === "control";

  function applyFilter(nextFilter: FarmFilter) {
    setFilter(nextFilter);
    if (nextFilter === "blockers") setSelectedId("K1C-04");
    if (nextFilter === "control") setSelectedId("CTRL-01");
  }

  function toggleManualBusy() {
    setManualBusy((current) => ({ ...current, [selected.id]: !current[selected.id] }));
  }

  return (
    <div className={styles.page}>
      <Surface className={styles.farmSurface}>
        <div className={styles.pageHeader}>
          <div className={styles.filters} aria-label="Фильтр фермы">
            {filters.map((item) => (
              <button key={item.value} className={filter === item.value ? styles.filterActive : ""} type="button" onClick={() => applyFilter(item.value)} aria-pressed={filter === item.value}>{item.label}</button>
            ))}
          </div>
        </div>

        <section className={styles.totals} aria-label="Состояние парка">
          {farmTotals.map((item) => (
            <div className={`${styles.totalItem} ${styles[item.tone]}`} key={item.label}>
              <div><strong>{item.label}</strong><span>{item.detail}</span></div>
              <DottedNumber compact>{item.value}</DottedNumber>
            </div>
          ))}
          <div className={styles.edgeMode}>
            <div><strong>Edge автономен</strong><span>локальный контур</span></div>
            <div className={styles.edgeValue}><RadioTower aria-hidden="true" /><strong>8</strong><span>устройств под FSM</span></div>
          </div>
        </section>

        <div className={styles.spatialMap} aria-label="Пространственная карта фермы">
          {showAutonomous ? (
            <div className={styles.autonomousRacks}>
              <RackSection rack="A" printers={rackA} selectedId={selectedId} filter={filter} busyState={manualBusy} onSelect={setSelectedId} />
              <RackSection rack="B" printers={rackB} selectedId={selectedId} filter={filter} busyState={manualBusy} onSelect={setSelectedId} />
            </div>
          ) : null}

          {showControl ? (
            <section className={styles.controlZone} aria-label="Зона Control-only">
              <header><div><Factory aria-hidden="true" /><strong>Control-only</strong></div><span>Камера, реле и ручной учёт · без команд прошивки</span></header>
              <div>
                {controlPrinters.map((printer) => (
                  <PrinterTile key={printer.id} printer={printer} selected={selectedId === printer.id} muted={false} busy={Boolean(manualBusy[printer.id])} onSelect={setSelectedId} />
                ))}
                <div className={styles.controlContract}><Wifi aria-hidden="true" /><p><strong>Контур наблюдения</strong><span>Состояние подтверждает оператор; команды принтеру не передаются.</span></p></div>
              </div>
            </section>
          ) : null}
        </div>
      </Surface>

      <aside className={styles.contextRail} aria-label="Выбранный принтер">
        <Surface className={styles.contextCard}>
          <div className={styles.contextHeader}>
            <div><span>{selected.rack === "Control" ? "Зона Control-only" : `Стойка ${selected.rack}`}</span><h2>{selected.id}</h2></div>
            <span className={`${styles.stateTag} ${styles[selected.state]}`}>{stateLabel[selected.state]}</span>
          </div>

          <div className={`${styles.cameraFrame} ${liveCamera ? styles.cameraLive : ""}`}>
            <img className={styles.cameraImage} src={`${import.meta.env.BASE_URL}assets/farm-print-camera-v1.webp`} alt={`Кадр печати ${selected.id}`} />
            <div><span>{liveCamera ? "LIVE" : "LAST FRAME"}</span><time>{liveCamera ? "сейчас" : selected.cameraAt}</time></div>
            <Camera aria-hidden="true" />
          </div>

          <button className={styles.cameraToggle} type="button" onClick={() => setLiveCamera((current) => !current)}>
            <ScanLine aria-hidden="true" />{liveCamera ? "Закрыть live-кадр" : "Открыть live-кадр"}
          </button>

          <div className={styles.fsmRow}><span>FSM</span><strong>{selected.fsm}</strong><CircleGauge aria-hidden="true" /></div>

          <dl className={styles.objectFacts}>
            <div><dt>Режим</dt><dd>{selected.mode === "autonomous" ? "Автономный" : "Control-only"}</dd></div>
            <div><dt>Материал</dt><dd>{selected.material}</dd></div>
            <div><dt>Источник</dt><dd>{selected.source}</dd></div>
            {selected.reason ? <div><dt>Причина</dt><dd>{selected.reason}</dd></div> : null}
          </dl>

          <div className={`${styles.nextAction} ${selected.reason ? styles.actionWarning : styles.actionStable}`}>
            <span>СЛЕДУЮЩЕЕ ДЕЙСТВИЕ</span>
            <strong>{selected.nextAction}</strong>
            {selected.mode === "control" ? (
              <button type="button" onClick={toggleManualBusy}>{manualBusy[selected.id] ? "Отметить свободным" : "Отметить занятым"}<CheckCircle2 aria-hidden="true" /></button>
            ) : null}
          </div>

          <div className={styles.recentEvents}>
            <div><span>ПОСЛЕДНИЕ СОБЫТИЯ</span><Clock3 aria-hidden="true" /></div>
            {selected.events.map((event) => <p key={`${event.time}-${event.message}`}><time>{event.time}</time><i className={styles[event.tone]} /><span>{event.message}</span></p>)}
          </div>

          <div className={styles.contextActions}>
            <Link to={`/printers/${selected.id}`}>Открыть карточку <ArrowUpRight aria-hidden="true" /></Link>
            <Link to="/tasks"><Wrench aria-hidden="true" />Создать задачу</Link>
          </div>
        </Surface>
      </aside>
    </div>
  );
}
