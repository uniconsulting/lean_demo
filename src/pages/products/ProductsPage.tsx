import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCode2,
  FlaskConical,
  Image as ImageIcon,
  Layers3,
  Minus,
  Moon,
  PackagePlus,
  Plus,
  Printer,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DottedNumber } from "../../components/ui/DottedNumber";
import { Surface } from "../../components/ui/Surface";
import { productCounts, products, type Product, type ProductStatus } from "../../data/products";
import styles from "./ProductsPage.module.css";

type Filter = "all" | "night" | "calibrating" | "blocked";

const filters: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "Все", count: productCounts.all },
  { id: "night", label: "Ночь", count: productCounts.night },
  { id: "calibrating", label: "Калибровка", count: productCounts.calibrating },
  { id: "blocked", label: "Блокеры", count: productCounts.blocked },
];

const statusLabels: Record<ProductStatus, string> = {
  night: "ночь допущена",
  series: "только серия",
  calibrating: "калибровка",
  blocked: "блокер",
};

function Admission({ allowed, night }: { allowed: boolean; night?: boolean }) {
  return (
    <span className={`${styles.admissionStatus} ${allowed ? styles.admissionReady : styles.admissionClosed}`}>
      {allowed ? <CheckCircle2 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}
      {night ? allowed ? "к ночи" : "ночь закрыта" : allowed ? "к серии" : "не допущено"}
    </span>
  );
}

function ProductRow({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <article className={`${styles.productRow} ${selected ? styles.productSelected : ""} ${styles[`tone_${product.status}`]}`}>
      <button className={styles.rowSelect} type="button" onClick={() => onSelect(product.id)} aria-pressed={selected} aria-label={`Открыть ${product.name}`}>
        <div className={styles.productObject}><img src={`${import.meta.env.BASE_URL}${product.asset}`} alt={`Схема изделия ${product.name}`} /></div>
        <div className={styles.productIdentity}><strong>{product.name}</strong><span>{product.id} · {product.format} · {product.version}</span></div>
        <div className={styles.productFact}><strong>{product.material}</strong><span>{product.profile ?? "профиль отсутствует"}</span></div>
        <div className={styles.calibration}>
          <strong>{product.calibrationDone} из {product.calibrationTarget} калибровок</strong>
          <span>{product.references} эталонов первого слоя</span>
          <div aria-label={`${product.calibrationDone} из ${product.calibrationTarget} калибровок`}>{Array.from({ length: product.calibrationTarget }, (_, index) => <i className={index < product.calibrationDone ? styles.calibrationDone : ""} key={index} />)}</div>
        </div>
        <Admission allowed={product.seriesAllowed} />
        <Admission allowed={product.nightAllowed} night />
      </button>
    </article>
  );
}

export default function ProductsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(40);
  const [created, setCreated] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    return products.filter((product) => {
      const matchesFilter = filter === "all" || product.status === filter || filter === "night" && product.nightAllowed;
      const matchesQuery = !normalized || `${product.name} ${product.id} ${product.material}`.toLocaleLowerCase("ru").includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selected = products.find((product) => product.id === selectedId) ?? products[0];

  function openSeriesDialog() {
    setCreated(false);
    setQuantity(40);
    setDialogOpen(true);
  }

  function createSeries() {
    setCreated(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainColumn}>
        <Surface className={styles.hero}>
          <div className={styles.heroHeader}>
            <div><h1>Библиотека изделий</h1><p>Модель, профиль и допуски собраны вокруг производственного объекта — до создания серии.</p></div>
            <div className={styles.heroActions}><Link to={`/products/${selected.id}/slicer`}><Upload aria-hidden="true" />Готовый G-code</Link><Link className={styles.primaryAction} to="/products/new"><Plus aria-hidden="true" />Новое изделие</Link></div>
          </div>
          <div className={styles.catalogTools}>
            <label className={styles.searchField}><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название, ID или материал" aria-label="Поиск изделий" /></label>
            <div className={styles.filters} aria-label="Фильтры изделий">{filters.map((item) => <button className={filter === item.id ? styles.filterActive : ""} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} key={item.id}>{item.label}<b>{item.count}</b></button>)}</div>
            <button className={styles.materialFilter} type="button"><SlidersHorizontal aria-hidden="true" />PLA / PETG<ChevronDown aria-hidden="true" /></button>
          </div>
        </Surface>

        <Surface className={styles.catalogSurface}>
          <div className={styles.sectionHeader}><div><h2>Номенклатура</h2><p>Допуск к серии и к ночи показан раздельно и объяснимо.</p></div><span>{filteredProducts.length} показано · выпуск</span></div>
          <div className={styles.columnLabels} aria-hidden="true"><span>Изделие</span><span>Материал / профиль</span><span>Калибровка</span><span>Серия</span><span>Ночь</span></div>
          <div className={styles.productList}>
            {filteredProducts.length ? filteredProducts.map((product) => <ProductRow product={product} selected={product.id === selected.id} onSelect={setSelectedId} key={product.id} />) : <div className={styles.emptyState}><Search aria-hidden="true" /><strong>Изделия не найдены</strong><span>Измените запрос или сбросьте фильтр.</span><button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>Сбросить</button></div>}
          </div>
        </Surface>

        <Surface className={styles.admissionSurface}>
          <div className={styles.admissionIntro}><h2>Контур допуска</h2><p>Ночной допуск появляется только после полного производственного пути.</p></div>
          {[
            [Layers3, "Модель", selected.version, true],
            [FileCode2, "Профиль", selected.profile ? "проверен" : "отсутствует", Boolean(selected.profile)],
            [FlaskConical, "Калибровка", `${selected.calibrationDone} / ${selected.calibrationTarget}`, selected.calibrationDone >= selected.calibrationTarget],
            [ImageIcon, "Эталоны", `${selected.references} принято`, selected.references >= 3],
            [Printer, "Совместимость", `${selected.compatiblePrinters.length} принтера`, selected.compatiblePrinters.length > 0],
          ].map(([Icon, label, value, ready]) => {
            const StepIcon = Icon as typeof Layers3;
            return <article className={ready ? styles.stepReady : styles.stepBlocked} key={String(label)}><div><StepIcon aria-hidden="true" />{ready ? <Check aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}</div><strong>{String(label)}</strong><span>{String(value)}</span></article>;
          })}
        </Surface>
      </div>

      <aside className={styles.rail}>
        <Surface className={styles.detailCard}>
          <div className={styles.detailHeader}><div><span>ВЫБРАНО ИЗДЕЛИЕ</span><h2>{selected.name}</h2></div><b className={styles[`status_${selected.status}`]}>{statusLabels[selected.status]}</b></div>
          <div className={styles.productPreview}><img src={`${import.meta.env.BASE_URL}${selected.asset}`} alt={`Схема изделия ${selected.name}`} /><span>{selected.format} · {selected.version}</span></div>
          <dl className={styles.detailFacts}><div><dt>Обновлено</dt><dd>{selected.updatedAt}</dd></div><div><dt>Эталоны слоя</dt><dd>{selected.references} принято</dd></div><div><dt>Совместимость</dt><dd>{selected.compatiblePrinters.length} принтера</dd></div><div><dt>Артефакт</dt><dd>{selected.artifact ?? "не создан"}</dd></div></dl>
          <div className={styles.detailActions}>
            {selected.seriesAllowed ? <button className={styles.seriesButton} type="button" onClick={openSeriesDialog}><PackagePlus aria-hidden="true" />Поставить серию<ArrowUpRight aria-hidden="true" /></button> : <Link className={styles.seriesButton} to="/products/new"><FlaskConical aria-hidden="true" />Продолжить onboarding<ArrowUpRight aria-hidden="true" /></Link>}
            <Link to={`/products/${selected.id}/slicer`}><FileCode2 aria-hidden="true" />Открыть слайсер-поток<ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </Surface>

        <Surface className={`${styles.reasonCard} ${selected.blocker ? styles.reasonBlocked : styles.reasonReady}`}>
          {selected.blocker ? <AlertTriangle aria-hidden="true" /> : <Moon aria-hidden="true" />}
          <div><h3>{selected.blocker ? "Что ограничивает допуск" : "Изделие готово к ночи"}</h3><p>{selected.blocker ?? `Профиль, ${selected.calibrationDone} калибровок и ${selected.references} эталонов подтверждены. Доступны ${selected.compatiblePrinters.length} совместимых принтера.`}</p></div>
        </Surface>
      </aside>

      {dialogOpen ? createPortal(
        <div className={styles.dialogBackdrop} role="presentation">
          <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="products-dialog-title">
            <button className={styles.dialogClose} type="button" onClick={() => setDialogOpen(false)} aria-label="Закрыть"><X aria-hidden="true" /></button>
            <div className={created ? styles.dialogSuccess : styles.dialogIcon}>{created ? <CheckCircle2 aria-hidden="true" /> : <PackagePlus aria-hidden="true" />}</div>
            <span>{created ? "СЕРИЯ СОЗДАНА" : "НОВАЯ СЕРИЯ"}</span>
            <h2 id="products-dialog-title">{created ? `${selected.name} добавлен в очередь` : selected.name}</h2>
            <p>{created ? `Серия ${quantity} шт. создана на mock-данных. Диспетчер назначит совместимые принтеры.` : `${selected.material} · ${selected.profile}. Изделие допущено к серии${selected.nightAllowed ? " и ночной смене" : ""}.`}</p>
            {created ? <div className={styles.createdSummary}><strong>{quantity} шт.</strong><span>{selected.compatiblePrinters.join(" · ")}</span></div> : <div className={styles.quantity}><span>Количество</span><div><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 10))}><Minus aria-hidden="true" /></button><DottedNumber compact>{String(quantity)}</DottedNumber><button type="button" onClick={() => setQuantity((value) => value + 10)}><Plus aria-hidden="true" /></button></div></div>}
            <div className={styles.dialogActions}><button type="button" onClick={() => setDialogOpen(false)}>{created ? "Закрыть" : "Отмена"}</button>{created ? <Link to="/queue">Открыть очередь <ArrowUpRight aria-hidden="true" /></Link> : <button type="button" onClick={createSeries}>Создать серию <ArrowUpRight aria-hidden="true" /></button>}</div>
          </section>
        </div>, document.body,
      ) : null}
    </div>
  );
}
