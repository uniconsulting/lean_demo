import { useState, type CSSProperties } from "react";
import {
  AlertTriangle, Archive, ArrowRight, BarChart3, Check, CheckCircle2, Clock3,
  Download, FileCheck2, Gauge, History, LockKeyhole, PackageCheck, RotateCcw,
  ShieldCheck, Sparkles, Wrench, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { Surface } from "../../components/ui/Surface";
import { hourlyOutput, reportEvents, reportKpis } from "../../data/shiftReport";
import styles from "./ShiftReportPage.module.css";

export default function ShiftReportPage() {
  const [incidentResolved, setIncidentResolved] = useState(false);
  const [binReconciled, setBinReconciled] = useState(false);
  const [closed, setClosed] = useState(false);
  const [exported, setExported] = useState(false);
  const blockers = Number(!incidentResolved) + Number(!binReconciled);
  const ready = blockers === 0;

  return <div className={styles.page}>
    <div className={styles.mainColumn}>
      <Surface className={styles.hero}>
        <header className={styles.heroHead} aria-label="Период отчёта и экспорт"><div className={styles.reportPeriod}><Clock3 /><span><strong>07–08 июля</strong><small>22:00 — 06:00 · 8 часов работы</small></span></div><button type="button" onClick={() => setExported(true)}><Download />Экспорт CSV</button></header>

        <section className={styles.outcomeSurface}>
          <div className={styles.outcomeLead}><span>ВЫПУСК СМЕНЫ</span><div><DottedNumber compact>26</DottedNumber><em>годных</em></div><p><strong>2,8 кг</strong> · план выполнен на 112%</p></div>
          <div className={styles.summaryStrip}><article><small>Годен</small><strong>26</strong><span>96,3%</span></article><article><small>Брак</small><strong>1</strong><span>перепечатка создана</span></article><article><small>Загрузка</small><strong>82%</strong><span>автономной стойки</span></article><article><small>Вмешательства</small><strong>0</strong><span>ручных остановок</span></article></div>
          <div className={styles.chartHeader}><div><BarChart3 /><span><strong>Производственный ритм</strong><small>деталей в час · 22:00–06:00</small></span></div><span>план 23</span></div>
          <div className={styles.chart} aria-label="Выпуск по часам">{hourlyOutput.map((item) => <article key={item.hour}><div className={styles.barTrack}><i style={{ "--bar": `${item.passed * 16}%` } as CSSProperties} />{item.rejected ? <b title="Брак" /> : null}</div><strong>{item.passed}</strong><time>{item.hour}:00</time></article>)}</div>
          <div className={styles.timeline}><span>22:00 · старт</span><i /><span>02:22 · INC-148</span><i /><span>05:57 · последняя деталь</span></div>
        </section>
        {exported ? <div className={styles.toast}><Check />shift-2026-07-08.csv подготовлен <button type="button" onClick={() => setExported(false)} aria-label="Закрыть"><X /></button></div> : null}
      </Surface>

      <div className={styles.lowerGrid}>
        <Surface className={styles.kpiLedger}>
          <div className={styles.sectionHead}><div><Gauge /><span><strong>Производственные KPI</strong><small>контракт пилота · без ручного сведения</small></span></div><span>4 показателя</span></div>
          <div className={styles.kpiRows}>{reportKpis.map((kpi, index) => <article key={kpi.label}><i className={styles[`tone_${kpi.tone}`]}>{index + 1}</i><span><strong>{kpi.label}</strong><small>{kpi.note}</small></span><b>{kpi.label === "Трассируемость" && incidentResolved ? "27 / 27" : kpi.value}</b><em>{kpi.tone === "warning" && !incidentResolved ? "нужна сверка" : "в норме"}</em></article>)}</div>
        </Surface>

        <Surface className={styles.deviations}>
          <div className={styles.sectionHead}><div><History /><span><strong>Отклонения и вмешательства</strong><small>источник каждого события сохранён</small></span></div><Link to="/incidents">Все инциденты <ArrowRight /></Link></div>
          <div className={styles.eventList}>{reportEvents.map((event) => <article key={event.time}><time>{event.time}</time><i className={styles[`event_${event.tone}`]} /> <span><strong>{event.title}</strong><small>{event.detail}</small></span><em>{event.source}</em></article>)}</div>
          <div className={styles.integrityNote}><ShieldCheck /><span><strong>Не скрываем хвосты</strong><small>Цифры готовы, но отчёт не закрывается, пока физический и цифровой контуры не совпали.</small></span></div>
        </Surface>
      </div>
    </div>

    <aside className={styles.rail}>
      <Surface className={`${styles.closeCard} ${closed ? styles.closeCardDone : ready ? styles.closeCardReady : ""}`}>
        <div className={styles.closeTop}><span>{closed ? "ОТЧЁТ ЗАКРЫТ" : ready ? "ГОТОВ К ЗАКРЫТИЮ" : "ЗАКРЫТИЕ СМЕНЫ"}</span>{closed ? <FileCheck2 /> : ready ? <CheckCircle2 /> : <LockKeyhole />}</div>
        <h2>{closed ? "Итог зафиксирован" : ready ? "Все условия выполнены" : "Отчёт ждёт сверки"}</h2>
        <p>{closed ? "Версия 1 сохранена в аудите. Дальнейшие правки создадут новую версию." : ready ? "Физический и цифровой контуры совпадают. Можно зафиксировать итог смены." : `${blockers} условия не позволяют доверенно закрыть смену.`}</p>
        <div className={styles.gates}>
          <article className={styles.gateDone}><Check /><span><strong>Журнал синхронизирован</strong><small>edge → center · backlog 0</small></span></article>
          <article className={incidentResolved ? styles.gateDone : ""}>{incidentResolved ? <Check /> : <AlertTriangle />}<span><strong>Исход INC-148</strong><small>{incidentResolved ? "подтверждено оператором" : "нужен human outcome"}</small></span>{!incidentResolved ? <button type="button" onClick={() => setIncidentResolved(true)}>Подтвердить mock</button> : null}</article>
          <article className={binReconciled ? styles.gateDone : ""}>{binReconciled ? <Check /> : <Archive />}<span><strong>Сверка тары A-12</strong><small>{binReconciled ? "26 деталей подтверждено" : "физический пересчёт"}</small></span>{!binReconciled ? <button type="button" onClick={() => setBinReconciled(true)}>Сверить mock</button> : null}</article>
        </div>
        <div className={styles.closeActions}>{closed ? <button type="button" onClick={() => setClosed(false)}><RotateCcw />Открыть новую версию</button> : <button type="button" disabled={!ready} onClick={() => setClosed(true)}><FileCheck2 />Закрыть смену</button>}<Link to="/tasks"><Wrench />Открыть задачи</Link></div>
      </Surface>

      <Surface className={styles.syncCard}><div className={styles.sectionHead}><div><PackageCheck /><span><strong>Целостность данных</strong><small>6 источников отчёта</small></span></div></div><div className={styles.syncMetric}><DottedNumber compact>100</DottedNumber><span>%</span></div><p>Журнал, задания, принтеры, CV, задачи и тара доступны для аудита.</p></Surface>
      <Surface className={styles.noteCard}><Sparkles /><span><strong>Следующий отчёт</strong><small>Дневная смена · 18:00<br />Черновик появится автоматически.</small></span></Surface>
    </aside>
  </div>;
}
