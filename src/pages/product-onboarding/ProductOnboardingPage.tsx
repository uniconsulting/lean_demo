import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCode2,
  FlaskConical,
  Image as ImageIcon,
  RefreshCcw,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { DottedTime } from "../../components/ui/DottedTime";
import { Surface } from "../../components/ui/Surface";
import { calibrationJobs, gateChecks, onboardingSteps, sliceMetrics, type OnboardingPhase } from "../../data/productOnboarding";
import styles from "./ProductOnboardingPage.module.css";

const phaseOrder: OnboardingPhase[] = ["slice", "calibration", "references", "approved"];

function PhaseMetric({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
  const time = value.includes(":");
  const numeric = value.match(/^\d+/)?.[0] ?? value;
  const unit = value.slice(numeric.length).trim();
  return (
    <article className={`${styles.metric} ${tone === "signal" ? styles.metricSignal : ""}`}>
      <span>{label}</span>
      <strong>{time ? <DottedTime hours="2" minutes="14" /> : <><DottedNumber compact>{numeric}</DottedNumber>{unit ? <small>{unit}</small> : null}</>}</strong>
      <small>{note}</small>
    </article>
  );
}

export default function ProductOnboardingPage() {
  const [phase, setPhase] = useState<OnboardingPhase>("slice");
  const [filename, setFilename] = useState("Кожух вентилятора.3mf");
  const [profile, setProfile] = useState("K1C · PETG · PEI");
  const [acceptedReferences, setAcceptedReferences] = useState<number[]>([]);

  const currentIndex = phaseOrder.indexOf(phase) + 2;
  const allReferencesAccepted = acceptedReferences.length === 3;

  function advancePhase() {
    if (phase === "slice") setPhase("calibration");
    else if (phase === "calibration") setPhase("references");
    else if (phase === "references" && allReferencesAccepted) setPhase("approved");
  }

  function toggleReference(index: number) {
    setAcceptedReferences((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  }

  const action = phase === "slice"
    ? { title: "Создать три калибровочные печати", detail: "Печати пройдут под присмотром, первые слои попадут в human review.", label: "Создать 3 печати" }
    : phase === "calibration"
      ? { title: "Получить результаты печатей", detail: "Mock-состояние завершит три калибровки и подготовит первые слои к ревью.", label: "Завершить mock-печати" }
      : phase === "references"
        ? { title: "Принять эталоны первого слоя", detail: "Допуск к серии доступен после трёх подтверждённых человеком эталонов.", label: allReferencesAccepted ? "Выдать допуск к серии" : `Принято ${acceptedReferences.length} из 3` }
        : { title: "Изделие допущено к серии", detail: "Три эталона приняты. Ночной допуск появится после расширения базы до пяти стабильных печатей.", label: "Открыть библиотеку" };

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroHeader}>
            <div><h1>Из модели — в надёжную серию</h1><p>Шесть явных шагов не дают пропустить профиль, макросы или человеческое ревью первого слоя.</p></div>
            <div className={styles.heroActions}><span>черновик P-042</span><Link to="/products">Закрыть</Link></div>
          </div>
          <div className={styles.stepper}>
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              const done = index < currentIndex || phase === "approved";
              const current = index === currentIndex && phase !== "approved" || phase === "approved" && index === onboardingSteps.length - 1;
              return <article className={`${styles.step} ${done ? styles.stepDone : ""} ${current ? styles.stepCurrent : ""}`} key={step.id}><div><Icon aria-hidden="true" />{done ? <Check className={styles.stepState} aria-hidden="true" /> : null}</div><b>0{index + 1}</b><span>{step.label}</span></article>;
            })}
          </div>
        </Surface>

        <div className={styles.workbench}>
          <Surface className={styles.inputCard}>
            <div className={styles.sectionHeader}><h2>Входные данные</h2><span><CheckCircle2 aria-hidden="true" />загружено</span></div>
            <div className={styles.fileCard}>
              <img src={`${import.meta.env.BASE_URL}assets/product-fan-shroud.svg`} alt="Схема кожуха вентилятора" />
              <div><strong>{filename}</strong><span>4,8 MB · загружен 14:21</span><button type="button" onClick={() => setFilename((value) => value.includes("rev2") ? "Кожух вентилятора.3mf" : "Кожух вентилятора-rev2.3mf")}><RefreshCcw aria-hidden="true" />Заменить файл</button></div>
            </div>
            <dl className={styles.inputFacts}><div><dt>Материал</dt><dd>PETG · чёрный</dd></div><div><dt>Профиль</dt><dd><button type="button" onClick={() => setProfile((value) => value.includes("Standard") ? "K1C · PETG · PEI" : "K1C · PETG Standard · PEI")}>{profile}<ChevronDown aria-hidden="true" /></button></dd></div><div><dt>Совместимость</dt><dd>4 принтера</dd></div></dl>
          </Surface>

          <Surface className={styles.sliceCard}>
            <div className={styles.sectionHeader}><h2>Результат слайсинга</h2><span><CheckCircle2 aria-hidden="true" />готов</span></div>
            <div className={styles.metrics}>{sliceMetrics.map((metric) => <PhaseMetric {...metric} key={metric.label} />)}</div>
            <div className={styles.macros}><b>FIRST_LAYER_CHECKPOINT</b><b>COOLDOWN_EJECT</b><b>PARK</b></div>
            <Link className={styles.artifactLink} to="/products/P-042/slicer"><FileCode2 aria-hidden="true" />Открыть артефакт 74e1<ArrowUpRight aria-hidden="true" /></Link>
          </Surface>
        </div>

        <Surface className={styles.progressSurface}>
          {phase === "slice" ? <div className={styles.progressIntro}><div><h2>Дальше — калибровочные печати</h2><p>Допуск появляется только после 3–5 подтверждённых первых слоёв и результата человека.</p></div><button type="button" onClick={advancePhase}><FlaskConical aria-hidden="true" />Создать 3 печати</button></div> : null}
          {phase === "calibration" ? <div><div className={styles.progressHeader}><div><h2>Калибровочные печати</h2><p>Созданы на mock-данных; реальные команды принтерам не отправляются.</p></div><span>3 задания</span></div><div className={styles.calibrationList}>{calibrationJobs.map((job, index) => <article key={job.id}><b>0{index + 1}</b><div><strong>{job.id}</strong><span>{job.printer}</span></div><div><strong>{job.status}</strong><span>{job.result}</span></div><em>{index === 0 ? "кадр получен" : "ожидает"}</em></article>)}</div></div> : null}
          {phase === "references" || phase === "approved" ? <div><div className={styles.progressHeader}><div><h2>Эталоны первого слоя</h2><p>Каждый кадр получает отдельное решение оператора.</p></div><span>{acceptedReferences.length} из 3 принято</span></div><div className={styles.references}>{[0, 1, 2].map((index) => { const accepted = acceptedReferences.includes(index) || phase === "approved"; return <article className={accepted ? styles.referenceAccepted : ""} key={index}><div><ImageIcon aria-hidden="true" /><span>слой 01 · C0{index + 1}</span></div><strong>{accepted ? "Эталон принят" : "Ожидает human review"}</strong><button type="button" onClick={() => toggleReference(index)} disabled={phase === "approved"}>{accepted ? <CheckCircle2 aria-hidden="true" /> : <Check aria-hidden="true" />}{accepted ? "Принято" : "Принять эталон"}</button></article>; })}</div></div> : null}
        </Surface>
      </div>

      <aside className={styles.rail}>
        <Surface className={styles.gateCard}>
          <div className={styles.gateHeader}><h2>Гейт шага 03</h2><span><CheckCircle2 aria-hidden="true" />пройден</span></div>
          <div className={styles.gateChecks}>{gateChecks.map((check) => <article key={check.title}><b><Check aria-hidden="true" /></b><div><strong>{check.title}</strong><span>{check.detail}</span></div></article>)}</div>
        </Surface>
        <Surface tone={phase === "approved" ? "success" : "warning"} className={styles.actionCard}>
          <span>СЛЕДУЮЩЕЕ ДЕЙСТВИЕ</span><h2>{action.title}</h2><p>{action.detail}</p>
          {phase === "approved" ? <Link to="/products">{action.label}<ArrowUpRight aria-hidden="true" /></Link> : <button type="button" onClick={advancePhase} disabled={phase === "references" && !allReferencesAccepted}>{action.label}<ArrowUpRight aria-hidden="true" /></button>}
        </Surface>
        <Surface className={styles.nightCard}>
          {phase === "approved" ? <CheckCircle2 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}
          <div><h3>{phase === "approved" ? "Допуск к серии выдан" : "До ночного допуска"}</h3><p>{phase === "approved" ? "Нужно добавить ещё два стабильных эталона и подтвердить ночную автономность." : "Закончить калибровку, принять эталоны и подтвердить стабильность результата."}</p></div>
        </Surface>
      </aside>
    </div>
  );
}
