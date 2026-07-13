import { useMemo, useState } from "react";
import {
  AlertTriangle, Archive, ArrowRight, Box, Check, CheckCircle2, Clock3, Copy,
  Database, Download, FileCode2, Filter, Image, PackageCheck, Printer, RefreshCw,
  Scale, Search, ShieldCheck, SlidersHorizontal, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Surface } from "../../components/ui/Surface";
import { partRecords, type PartOutcome } from "../../data/partsJournal";
import styles from "./PartsJournalPage.module.css";

type OutcomeFilter = "all" | PartOutcome;

const outcomes: Record<PartOutcome, string> = { passed: "Годен", rejected: "Брак", review: "Уточнить исход" };

export default function PartsJournalPage() {
  const [selectedId, setSelectedId] = useState("PT-000271");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OutcomeFilter>("all");
  const [resolved, setResolved] = useState<Record<string, PartOutcome>>({});
  const [binChecked, setBinChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const records = useMemo(() => partRecords.filter((record) => {
    const outcome = resolved[record.id] ?? record.outcome;
    const matchesFilter = filter === "all" || outcome === filter;
    const haystack = `${record.id} ${record.product} ${record.printer} ${record.spool} ${record.incident ?? ""}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [filter, query, resolved]);
  const selected = partRecords.find((record) => record.id === selectedId) ?? partRecords[1];
  const outcome = resolved[selected.id] ?? selected.outcome;

  function copyId() {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return <div className={styles.page}>
    <div className={styles.mainColumn}>
      <Surface className={styles.hero}>
        <div className={styles.controls}><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ID, изделие, принтер, катушка…" /></label><button type="button" aria-label="Расширенные фильтры"><SlidersHorizontal /></button><div className={styles.filters} role="tablist" aria-label="Фильтр исхода">{(["all", "passed", "rejected", "review"] as OutcomeFilter[]).map((value) => <button className={filter === value ? styles.filterActive : ""} role="tab" aria-selected={filter === value} type="button" onClick={() => setFilter(value)} key={value}>{value === "all" ? "Все · 26" : outcomes[value]}</button>)}</div></div>
        <div className={styles.heroActions}><button type="button" onClick={() => setExported(true)}><Download />Экспорт CSV</button><div><RefreshCw /><span><strong>Edge → Центр</strong><small>синхронизировано · 14:32</small></span></div></div>
        {exported ? <div className={styles.toast}><Check />parts-shift-07.csv подготовлен <button type="button" onClick={() => setExported(false)} aria-label="Закрыть"><X /></button></div> : null}
      </Surface>

      <Surface className={styles.workspace}>
        <aside className={styles.ledger}>
          <div className={styles.ledgerHead}><div><Filter /><span><strong>Экземпляры смены</strong><small>{records.length} показано · edge-журнал</small></span></div><time>Сегодня</time></div>
          <div className={styles.recordList}>{records.map((record) => {
            const recordOutcome = resolved[record.id] ?? record.outcome;
            return <button className={`${styles.record} ${selected.id === record.id ? styles.recordSelected : ""} ${styles[`record_${recordOutcome}`]}`} type="button" onClick={() => { setSelectedId(record.id); setBinChecked(false); }} aria-pressed={selected.id === record.id} key={record.id}><span className={styles.recordIcon}>{recordOutcome === "passed" ? <CheckCircle2 /> : <AlertTriangle />}</span><span><span><strong>{record.id}</strong><time>{record.time}</time></span><small>{record.product} {record.version}</small><em>{record.printer} · {record.material} {record.spool}</em></span></button>;
          })}{records.length === 0 ? <div className={styles.empty}>Записей по фильтру нет</div> : null}</div>
          <p className={styles.edgeNote}><Database />Edge-журнал первичен. Пустой ответ центра не скрывает локальные записи.</p>
        </aside>

        <section className={styles.stage}>
          <img src={`${import.meta.env.BASE_URL}assets/part-trace-sensor-housing-v1.png`} alt="Корпус датчика в физической таре" />
          <div className={styles.stageWash} aria-hidden="true" />
          <header className={styles.partHead}><div><span className={`${styles.outcome} ${styles[`outcome_${outcome}`]}`}>{outcome === "passed" ? <CheckCircle2 /> : <AlertTriangle />}{outcomes[outcome]}</span><h2>{selected.id}</h2><p>{selected.product} {selected.version}</p></div><button type="button" onClick={copyId}>{copied ? <Check /> : <Copy />}{copied ? "Скопировано" : "Копировать ID"}</button></header>
          <div className={`${styles.callout} ${styles.printCallout}`}><Printer /><span><small>Принтер</small><strong>{selected.printer}</strong><em>серия K1C · online</em></span></div>
          <div className={`${styles.callout} ${styles.materialCallout}`}><Database /><span><small>Материал</small><strong>{selected.material} {selected.spool}</strong><em>партия NP-17-2412</em></span></div>
          <div className={`${styles.callout} ${styles.timeCallout}`}><Clock3 /><span><small>Напечатано</small><strong>сегодня, {selected.time}</strong><em>38 минут</em></span></div>
          <div className={`${styles.callout} ${styles.binCallout}`}><Archive /><span><small>Физический маршрут</small><strong>{selected.bin}</strong><em>ячейка тары</em></span></div>
          <div className={styles.objectFacts}><div><Scale /><span><strong>{selected.weight} г</strong><small>фактический вес</small></span></div><div><Image /><span><strong>3 кадра</strong><small>финальная CV-проверка</small></span></div></div>
          {outcome === "review" ? <div className={styles.reviewPanel}><AlertTriangle /><span><strong>{selected.incident} · исход не закрыт</strong><small>Физическая деталь остаётся в карантине до решения человека.</small></span><div><button type="button" onClick={() => setResolved((current) => ({ ...current, [selected.id]: "rejected" }))}>Признать браком</button><button type="button" onClick={() => setResolved((current) => ({ ...current, [selected.id]: "passed" }))}>Подтвердить годность</button></div></div> : null}
          <div className={styles.lineage}><div className={styles.lineageTitle}><strong>Цепочка происхождения</strong><span>7 подтверждённых узлов</span></div><div className={styles.runway}><article><Box /><span>Изделие<strong>{selected.version}</strong></span></article><ArrowRight /><article><FileCode2 /><span>slice<strong>{selected.slice}</strong></span></article><ArrowRight /><article><PackageCheck /><span>job<strong>{selected.job}</strong></span></article><ArrowRight /><article><Printer /><span>принтер<strong>{selected.printer}</strong></span></article><ArrowRight /><article><Database /><span>катушка<strong>{selected.spool}</strong></span></article><ArrowRight /><article className={styles.runwayVerdict}><ShieldCheck /><span>CV<strong>{outcomes[outcome]}</strong></span></article><ArrowRight /><article><Archive /><span>тара<strong>{selected.bin}</strong></span></article></div></div>
        </section>
      </Surface>
    </div>

    <aside className={styles.rail}>
      <Surface className={styles.syncCard}><div className={styles.railHead}><div><RefreshCw /><span><strong>Синхронизация</strong><small>edge → center</small></span></div><span>online</span></div><h2>След<br />синхронизирован</h2><p>Последняя запись передана в 14:32:08. Локальный backlog: 0.</p><button type="button">История передачи <ArrowRight /></button></Surface>
      <Surface className={`${styles.verdictCard} ${styles[`verdict_${outcome}`]}`}><div className={styles.railHead}><div><ShieldCheck /><span><strong>Качество</strong><small>human + CV</small></span></div></div><h2>{outcomes[outcome]}</h2><dl><div><dt>Проверки</dt><dd>{outcome === "review" ? "2 / 3" : "3 / 3"}</dd></div><div><dt>Отклонения</dt><dd>{outcome === "passed" ? "0" : "1"}</dd></div><div><dt>Инцидент</dt><dd>{selected.incident ?? "—"}</dd></div></dl>{selected.incident ? <Link to="/incidents">Открыть {selected.incident} <ArrowRight /></Link> : null}</Surface>
      <Surface className={styles.binCard}><div className={styles.railHead}><div><Archive /><span><strong>Сверка с тарой</strong><small>физический контур</small></span></div></div><p>Ожидается: <strong>{selected.bin}</strong><br />Фактически: <strong>{binChecked ? selected.bin : "не сверено"}</strong></p><button className={binChecked ? styles.checkedButton : ""} type="button" onClick={() => setBinChecked((value) => !value)}>{binChecked ? <Check /> : <Archive />}{binChecked ? "Совпадение подтверждено" : "Сверить тару"}</button></Surface>
    </aside>
  </div>;
}
