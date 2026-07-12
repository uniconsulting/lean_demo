import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Box,
  Check,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Flame,
  MoonStar,
  PackageCheck,
  RadioTower,
  RefreshCcw,
  ShieldCheck,
  Spool,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { DottedTime } from "../../components/ui/DottedTime";
import { LiveDot } from "../../components/ui/LiveDot";
import { Surface } from "../../components/ui/Surface";
import { PrinterStatusTile } from "../../components/domain/PrinterStatusTile";
import { nightChecks, nightPolicy, nightPrinters, type NightCheckId } from "../../data/night";
import styles from "./NightPage.module.css";

const checkIcons = {
  queue: Clock3,
  filament: Spool,
  bin: Box,
  preflight: CircleGauge,
  fire: Flame,
  edge: RadioTower,
  center: RefreshCcw,
} satisfies Record<NightCheckId, typeof Clock3>;

const coverageChart = Array.from({ length: 14 }, (_, index) => index);

export default function NightPage() {
  const [binReady, setBinReady] = useState(false);
  const [filamentReady, setFilamentReady] = useState(false);
  const [excluded, setExcluded] = useState(false);
  const [approved, setApproved] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);

  const materialResolved = filamentReady || excluded;
  const readyCount = 5 + Number(binReady) + Number(materialResolved);
  const preflight = binReady ? "8 из 8" : "7 из 8";
  const blockers = 7 - readyCount;
  const canApprove = blockers === 0;
  const nextAction = !binReady ? "bin" : !materialResolved ? "filament" : "approve";
  const includedPrinters = excluded ? 7 : 8;

  const resolvedChecks = useMemo(() => new Set<NightCheckId>([
    "queue",
    ...(materialResolved ? ["filament" as const] : []),
    ...(binReady ? ["bin" as const] : []),
    "preflight",
    "fire",
    "edge",
    "center",
  ]), [binReady, materialResolved]);

  function approveNight() {
    if (!canApprove) return;
    setApproved(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroHeader}>
            <div><h1>Зарядить ночь</h1><p>Проверка автономности до ухода оператора — без обхода физических блокеров.</p></div>
            <div className={styles.countdown}><Clock3 aria-hidden="true" />до смены · 02:18</div>
          </div>
          <div className={styles.heroGrid}>
            <article className={`${styles.readinessCard} ${approved ? styles.readinessApproved : ""}`}>
              <div className={styles.metricTop}><div className={styles.metricLabel}><MoonStar aria-hidden="true" /><span>ГОТОВНОСТЬ НОЧИ</span></div></div>
              <div className={styles.readinessValue}><DottedNumber>{String(readyCount)}</DottedNumber><small>из 7 проверок</small></div>
              <p>{approved ? "Ночь подтверждена" : canApprove ? "Можно подтверждать" : "Ночь не готова"}</p>
              <div className={styles.readinessAxis} aria-hidden="true">{nightChecks.map((check, index) => <i className={index < readyCount ? styles.axisReady : ""} key={check.id} />)}</div>
            </article>
            <article className={styles.coverageCard}>
              <div className={styles.metricTop}><div className={styles.metricLabel}><Clock3 aria-hidden="true" /><span>ПОКРЫТИЕ ОЧЕРЕДИ</span></div><Link className={styles.coverageOpen} to="/queue" aria-label="Открыть очередь"><ArrowUpRight aria-hidden="true" /></Link></div>
              <div className={styles.coverageValue}><DottedTime hours={excluded ? "15" : "18"} minutes={excluded ? "20" : "40"} /><small>часов</small></div>
              <p>Цель ночи — 12 часов</p>
              <div className={styles.coverageBars} aria-hidden="true">{coverageChart.map((index) => <i key={index} />)}</div>
            </article>
            <article className={styles.metricCard}><DottedNumber compact>{binReady ? "8/8" : "7/8"}</DottedNumber><strong>Preflight</strong><small>автономные</small></article>
            <article className={styles.metricCard}><DottedNumber compact>{String(blockers)}</DottedNumber><strong>Блокера</strong><small>физические</small></article>
          </div>
        </Surface>

        <Surface className={styles.checkSurface}>
          <div className={styles.sectionHeader}><div><h2>Контур готовности</h2><p>Каждый статус подтверждается источником, а не только цветом.</p></div><span>{readyCount} из 7 готовы</span></div>
          <div className={styles.checkRunway}>
            {nightChecks.map((check) => {
              const Icon = checkIcons[check.id];
              const ready = resolvedChecks.has(check.id);
              const detail = check.id === "preflight" ? preflight : check.id === "filament" && materialResolved ? (excluded ? "K1C-06 исключён" : "катушка заменена") : check.id === "bin" && binReady ? "тара освобождена" : check.detail;
              return <article className={`${styles.checkItem} ${ready ? styles.checkReady : styles.checkBlocked}`} key={check.id}><div><Icon aria-hidden="true" />{ready ? <Check className={styles.stateGlyph} aria-hidden="true" /> : <AlertTriangle className={styles.stateGlyph} aria-hidden="true" />}</div><strong>{check.label}</strong><span>{detail}</span></article>;
            })}
          </div>
        </Surface>

        <Surface className={styles.farmSurface}>
          <div className={styles.sectionHeader}><div><h2>Стойка автономии</h2><p>В ночь войдут только принтеры с подтверждённым физическим состоянием.</p></div><span>{includedPrinters} принтеров</span></div>
          <div className={styles.farmLayout}>
            <div className={styles.printerRack}>
              {nightPrinters.map((printer) => {
                const blocked = printer.blocker === "bin" ? !binReady : printer.blocker === "filament" ? !materialResolved : false;
                const omitted = printer.id === "K1C-06" && excluded;
                const status = omitted ? "исключён" : blocked ? printer.blocker === "bin" ? "ждёт тару" : "нет материала" : "готов";
                const trailing = printer.id === "K1C-04" && binReady ? "preflight 7/7" : printer.id === "K1C-06" && filamentReady ? "spool #19" : printer.fsm;
                return <PrinterStatusTile id={printer.id} status={status} tone={blocked ? "waiting" : "ready"} job={printer.job} material={printer.material} trailing={trailing} selected={blocked} muted={omitted} key={printer.id} />;
              })}
            </div>
            <div className={styles.blockerColumn}>
              <article className={`${styles.objectBlocker} ${binReady ? styles.objectResolved : ""}`}><div className={styles.blockerIcon}>{binReady ? <CheckCircle2 aria-hidden="true" /> : <Box aria-hidden="true" />}</div><div><strong>{binReady ? "Тара стойки A освобождена" : "Тара годных заполнена"}</strong><span>{binReady ? "Подтверждено оператором" : "Стойка A · весы 92%"}</span><button type="button" onClick={() => setBinReady((current) => !current)}>{binReady ? "Вернуть блокер" : "Подтвердить освобождение"}</button></div></article>
              <article className={`${styles.objectBlocker} ${materialResolved ? styles.objectResolved : ""}`}><div className={styles.blockerIcon}>{materialResolved ? <CheckCircle2 aria-hidden="true" /> : <Spool aria-hidden="true" />}</div><div><strong>{excluded ? "K1C-06 исключён из ночи" : filamentReady ? "Катушка заменена" : "Катушка #17 не покрывает #024"}</strong><span>{excluded ? "Покрытие пересчитано" : filamentReady ? "K1C-06 · катушка #19" : "K1C-06 · остаток 180 г"}</span><button type="button" onClick={() => { setFilamentReady((current) => !current); setExcluded(false); }}>{filamentReady ? "Вернуть блокер" : "Заменить катушку"}</button></div></article>
            </div>
          </div>
        </Surface>

        <Surface className={styles.policySurface}>
          <div className={styles.policyIntro}><ShieldCheck aria-hidden="true" /><div><h2>Политика ночи</h2><p>Edge продолжает безопасный план даже при потере центра.</p></div></div>
          {nightPolicy.map((rule) => <article key={rule.label}><span>{rule.label}</span><strong>{rule.value}</strong></article>)}
        </Surface>
      </div>

      <aside className={styles.contextRail}>
        <Surface tone={nextAction === "approve" ? "success" : "warning"} className={styles.nextAction}>
          <span>Следующее действие</span>
          <div className={styles.nextIcon}>{nextAction === "bin" ? <PackageCheck aria-hidden="true" /> : nextAction === "filament" ? <Spool aria-hidden="true" /> : <MoonStar aria-hidden="true" />}</div>
          <h2>{nextAction === "bin" ? "Освободить тару стойки A" : nextAction === "filament" ? "Заменить катушку #17" : approved ? "Ночная смена подтверждена" : "Подтвердить ночную смену"}</h2>
          <p>{nextAction === "bin" ? <>Заполнение 92%. После подтверждения K1C-04<br />автоматически повторит preflight.</> : nextAction === "filament" ? <>K1C-06 не хватает 220 г PETG.<br />После замены покрытие обновится.</> : <>Все семь проверок закрыты.<br />Edge mirror готов к автономной смене.</>}</p>
          {nextAction === "bin" ? <button type="button" onClick={() => setBinReady(true)}>Я освободил тару <Check aria-hidden="true" /></button> : nextAction === "filament" ? <button type="button" onClick={() => setFilamentReady(true)}>Катушка заменена <Check aria-hidden="true" /></button> : <button type="button" onClick={approveNight}>{approved ? "Подтверждено" : "Подтвердить ночь"}<Check aria-hidden="true" /></button>}
        </Surface>

        {!materialResolved ? <Surface className={styles.railBlocker}><span>Блокер 01</span><h3>Катушка #17 не покрывает серию #024</h3><p>K1C-06 · PETG · не хватает 220 г.</p><Link to="/printers/K1C-06">Открыть K1C-06 <ArrowUpRight aria-hidden="true" /></Link></Surface> : null}
        {!binReady ? <Surface className={styles.railBlocker}><span>Блокер 02</span><h3>Тара годных на стойке A заполнена</h3><p>Физическое подтверждение обязательно.</p><button type="button" onClick={() => setTaskCreated(true)}>{taskCreated ? "Задача создана" : "Создать задачу"}<ArrowUpRight aria-hidden="true" /></button></Surface> : null}

        <Surface tone="dark" className={styles.approvalCard}>
          <h3>Подтверждение ночи</h3><p>{canApprove ? "Все проверки закрыты. Подтверждение доступно оператору." : "Закройте два блокера или явно исключите затронутый принтер."}</p>
          <button className={styles.approveButton} type="button" disabled={!canApprove || approved} onClick={approveNight}>{approved ? "Ночь подтверждена" : "Подтвердить ночь"}</button>
          <button className={styles.excludeButton} type="button" disabled={filamentReady || approved} onClick={() => { setExcluded((current) => !current); setFilamentReady(false); }}>{excluded ? "Вернуть K1C-06" : "Исключить K1C-06"}</button>
          <div className={styles.edgeState}><LiveDot /><span>Edge mirror · актуален 14:26</span></div>
        </Surface>
      </aside>
    </div>
  );
}
