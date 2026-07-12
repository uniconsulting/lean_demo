import { useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleStop,
  Clock3,
  CloudUpload,
  FileBox,
  FileCode2,
  Gauge,
  LoaderCircle,
  PackagePlus,
  Play,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { DottedTime } from "../../components/ui/DottedTime";
import { Surface } from "../../components/ui/Surface";
import { pipelineSteps, requiredMacros, sliceQueue, type SlicerTab, type SliceState } from "../../data/slicer";
import styles from "./SlicerPage.module.css";

const tabs: { id: SlicerTab; label: string }[] = [
  { id: "model", label: "Модель + профиль" },
  { id: "gcode", label: "Готовый G-code" },
  { id: "artifacts", label: "Артефакты" },
];

export default function SlicerPage() {
  const { productId = "P-042" } = useParams();
  const [tab, setTab] = useState<SlicerTab>("model");
  const [sliceState, setSliceState] = useState<SliceState>("request");
  const [selectedQueue, setSelectedQueue] = useState("S-206");
  const [profileFixed, setProfileFixed] = useState(false);
  const [gcodeUploaded, setGcodeUploaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobCreated, setJobCreated] = useState(false);

  const ready = sliceState === "ready" || gcodeUploaded;
  const running = sliceState === "running";

  function startSlice() {
    setSliceState("running");
  }

  function finishSlice() {
    setSliceState("ready");
  }

  function openJobDialog() {
    setJobCreated(false);
    setDialogOpen(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroTop}>
            <div><span className={styles.eyebrow}>ИЗДЕЛИЕ {productId}</span><h1>Слайсер как прозрачный поток</h1><p>Каждый шаг объясним: от исходного файла до версионированного G-code с обязательными макросами.</p></div>
            <Link to="/products">Закрыть поток <X aria-hidden="true" /></Link>
          </div>
          <div className={styles.tabs} role="tablist" aria-label="Режим слайсер-потока">
            {tabs.map((item) => <button className={tab === item.id ? styles.tabActive : ""} role="tab" aria-selected={tab === item.id} type="button" onClick={() => setTab(item.id)} key={item.id}>{item.label}</button>)}
          </div>
        </Surface>

        {tab === "model" ? <Surface className={styles.workbench}>
          <div className={styles.objectPanel}>
            <div className={styles.sectionTitle}><div><FileBox aria-hidden="true" /><span>ИСХОДНЫЙ ОБЪЕКТ</span></div><b>валиден</b></div>
            <div className={styles.objectVisual}><img src={`${import.meta.env.BASE_URL}assets/product-fan-shroud.svg`} alt="Схема кожуха вентилятора" /><span>4,8 MB · 3MF</span></div>
            <h2>Кожух вентилятора</h2><p>Кожух вентилятора.3mf · версия 7</p>
            <dl className={styles.objectFacts}><div><dt>Профиль</dt><dd>K1C · PETG · PEI <ChevronDown aria-hidden="true" /></dd></div><div><dt>Назначение</dt><dd>K1C-01…08</dd></div></dl>
          </div>

          <div className={styles.pipelinePanel}>
            <div className={styles.pipelineHeader}><div><span>ТЕХНИЧЕСКИЙ КОНВЕЙЕР</span><h2>{ready ? "Артефакт готов к производству" : running ? "Orca CLI выполняет слайсинг" : "Всё готово к запуску"}</h2></div><span className={`${styles.stateBadge} ${ready ? styles.ready : running ? styles.processing : ""}`}>{ready ? <CheckCircle2 /> : running ? <LoaderCircle /> : <Play />}{ready ? "готов" : running ? "в процессе · 64%" : "ожидает"}</span></div>
            <div className={styles.pipeline}>
              {pipelineSteps.map((step, index) => {
                const active = ready || running && index <= 1 || !running && index === 0;
                const done = ready || running && index === 0;
                return <article className={`${styles.pipelineStep} ${active ? styles.pipelineActive : ""} ${done ? styles.pipelineDone : ""}`} key={step.id}><div>{done || ready ? <Check /> : index === 1 && running ? <LoaderCircle className={styles.spinner} /> : <span>0{index + 1}</span>}</div><strong>{step.label}</strong><small>{step.detail}</small></article>;
              })}
            </div>
            {running ? <div className={styles.runProgress}><div><span>Слой 118 из 184 · расчёт опор</span><b>64%</b></div><i><span /></i><button type="button" onClick={() => setSliceState("request")}><CircleStop aria-hidden="true" />Отменить</button><button type="button" onClick={finishSlice}><Check aria-hidden="true" />Завершить mock</button></div> : null}
            <div className={styles.artifactMetrics}>
              <article><Clock3 aria-hidden="true" /><span>Время</span><strong><DottedTime hours="2" minutes="14" /></strong><small>на деталь</small></article>
              <article><Gauge aria-hidden="true" /><span>Материал</span><strong><DottedNumber compact>96</DottedNumber><em>г</em></strong><small>расчёт Orca</small></article>
              <article className={styles.artifactIdentity}><FileCode2 aria-hidden="true" /><div><span>АРТЕФАКТ</span><strong>{ready ? "slice 74e1" : "будет создан"}</strong><small>профиль v1.4 · post-process v3</small></div></article>
            </div>
            <div className={styles.macroStrip}>{requiredMacros.map((macro) => <span key={macro}><Check aria-hidden="true" />{macro}</span>)}</div>
          </div>
        </Surface> : null}

        {tab === "gcode" ? <Surface className={styles.fallbackWorkbench}>
          <div className={styles.uploadDrop}><CloudUpload aria-hidden="true" /><span>СПАСАТЕЛЬНЫЙ ВХОД</span><h2>{gcodeUploaded ? "Готовый G-code проверен" : "Загрузить готовый G-code"}</h2><p>{gcodeUploaded ? "Файл стал трассируемым артефактом. Профиль и обязательные макросы сохранены в метаданных." : "Этот путь всегда доступен, если серверный слайсер недоступен или файл подготовлен технологом."}</p><button type="button" onClick={() => setGcodeUploaded(true)}>{gcodeUploaded ? <RefreshCcw /> : <Upload />}{gcodeUploaded ? "Заменить файл" : "Имитировать загрузку"}</button></div>
          <div className={styles.validationPanel}><div className={styles.sectionTitle}><div><ShieldCheck aria-hidden="true" /><span>ПРОВЕРКА КОНТРАКТА</span></div><b>{gcodeUploaded ? "пройдено" : "ожидает файл"}</b></div>{requiredMacros.map((macro) => <article key={macro}><span>{gcodeUploaded ? <Check /> : <FileCode2 />}</span><div><strong>{macro}</strong><small>{gcodeUploaded ? "обнаружен и зафиксирован" : "будет проверен после загрузки"}</small></div></article>)}</div>
        </Surface> : null}

        {tab === "artifacts" ? <Surface className={styles.artifactsView}><div className={styles.sectionHeader}><div><h2>Артефакты изделия</h2><p>Версия G-code всегда связана с исходником, профилем и post-processing.</p></div><span>2 версии</span></div><div className={styles.artifactList}>{[
          ["slice 74e1", "актуальный", "13 июл · 14:23", "v1.4", "2:14", "96 г"],
          ["slice 52b8", "архив", "11 июл · 18:04", "v1.3", "2:18", "99 г"],
        ].map((item, index) => <article className={index === 0 ? styles.currentArtifact : ""} key={item[0]}><FileCode2 aria-hidden="true" /><div><strong>{item[0]}</strong><span>{item[2]}</span></div><b>{item[1]}</b><dl><div><dt>Профиль</dt><dd>{item[3]}</dd></div><div><dt>Время</dt><dd>{item[4]}</dd></div><div><dt>Материал</dt><dd>{item[5]}</dd></div></dl><button type="button" onClick={() => { setSliceState("ready"); setTab("model"); }}>Открыть <ArrowUpRight /></button></article>)}</div></Surface> : null}

        <Surface className={styles.queueSurface}>
          <div className={styles.sectionHeader}><div><h2>Очередь слайсинга</h2><p>Причина ожидания видна до запуска производства.</p></div><span>1 в работе · 1 блокер</span></div>
          <div className={styles.queueList}>{sliceQueue.map((item) => {
            const fixed = item.id === "S-207" && profileFixed;
            return <article className={`${styles.queueRow} ${selectedQueue === item.id ? styles.queueSelected : ""}`} key={item.id}><button type="button" onClick={() => setSelectedQueue(item.id)}><span className={item.tone === "blocked" && !fixed ? styles.queueBlockedIcon : styles.queueRunningIcon}>{item.tone === "blocked" && !fixed ? <AlertTriangle /> : <LoaderCircle />}</span><div><strong>{item.name}</strong><small>{item.id} · {fixed ? "K1C · PLA · PEI" : item.profile}</small></div><b>{fixed ? "Готов к запуску" : item.status}</b><div className={styles.queueProgress}><i><span style={{ "--progress": `${fixed ? 0 : item.progress}%` } as React.CSSProperties} /></i><em>{fixed ? "профиль назначен" : item.progress ? `${item.progress}%` : "нужен профиль"}</em></div></button>{item.id === "S-207" && !profileFixed ? <button className={styles.fixProfile} type="button" onClick={() => setProfileFixed(true)}><Settings2 />Назначить профиль</button> : null}</article>;
          })}</div>
        </Surface>
      </div>

      <aside className={styles.rail}>
        <Surface tone={ready ? "success" : "info"} className={styles.actionCard}>
          <span>{ready ? "АРТЕФАКТ ГОТОВ" : "СЛЕДУЮЩЕЕ ДЕЙСТВИЕ"}</span><div className={styles.actionIcon}>{ready ? <CheckCircle2 /> : <Play />}</div><h2>{ready ? "Создать задание на печать" : running ? "Слайсинг выполняется" : "Запустить Orca CLI"}</h2><p>{ready ? "slice 74e1 проверен и готов к постановке в производственную очередь." : running ? "Можно остаться на экране или завершить mock-операцию вручную." : "Профиль v1.4 найден. Четыре обязательных макроса будут добавлены автоматически."}</p>{ready ? <button type="button" onClick={openJobDialog}><PackagePlus />Создать задание <ArrowUpRight /></button> : running ? <button type="button" onClick={finishSlice}><Check />Завершить mock <ArrowUpRight /></button> : <button type="button" onClick={startSlice}><Play />Запустить слайсинг <ArrowUpRight /></button>}
        </Surface>
        <Surface className={styles.rescueCard}><Upload aria-hidden="true" /><div><span>СПАСАТЕЛЬНЫЙ ВХОД</span><h3>Готовый G-code</h3><p>Всегда доступен как отдельный трассируемый путь.</p></div><button type="button" onClick={() => setTab("gcode")}>Открыть <ArrowUpRight /></button></Surface>
        <Surface className={styles.blockersCard}><div className={styles.sectionTitle}><div><AlertTriangle aria-hidden="true" /><span>БЛОКИРУЕТ ЗАПУСК</span></div></div><ul><li>нет совместимого профиля;</li><li>исходный файл не читается;</li><li>не найден обязательный макрос;</li><li>Orca worker недоступен.</li></ul><p>Недостаток материала остаётся предупреждением и требует решения оператора.</p></Surface>
      </aside>

      {dialogOpen ? createPortal(<div className={styles.dialogBackdrop} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="slicer-dialog-title"><button className={styles.dialogClose} type="button" onClick={() => setDialogOpen(false)} aria-label="Закрыть"><X /></button><div className={styles.dialogIcon}>{jobCreated ? <CheckCircle2 /> : <PackagePlus />}</div><span>{jobCreated ? "ЗАДАНИЕ СОЗДАНО" : "НОВОЕ ЗАДАНИЕ"}</span><h2 id="slicer-dialog-title">{jobCreated ? "slice 74e1 добавлен в очередь" : "Кожух вентилятора"}</h2><p>{jobCreated ? "Mock-задание создано без отправки команд оборудованию." : "Артефакт проверен. Совместимы K1C-01…08, материал PETG."}</p><div className={styles.dialogActions}><button type="button" onClick={() => setDialogOpen(false)}>{jobCreated ? "Закрыть" : "Отмена"}</button>{jobCreated ? <Link to="/queue">Открыть очередь <ArrowUpRight /></Link> : <button type="button" onClick={() => setJobCreated(true)}>Создать <ArrowUpRight /></button>}</div></section></div>, document.body) : null}
    </div>
  );
}
