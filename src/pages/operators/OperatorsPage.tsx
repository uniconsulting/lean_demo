import { useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, ArrowRight, Check, CheckCircle2, ChevronRight, ClipboardCheck,
  FileClock, GraduationCap, KeyRound, LockKeyhole, Plus, RadioTower, RotateCcw,
  Settings2, ShieldCheck, UserCheck, UserCog, UserRound, Users, Wrench, X,
} from "lucide-react";
import { Surface } from "../../components/ui/Surface";
import { onboardingSteps, operators, rolePermissions, type OperatorRole } from "../../data/operators";
import styles from "./OperatorsPage.module.css";

type Dialog = "role" | "invite" | "audit" | null;
const roleLabels: Record<OperatorRole, string> = { operator: "Оператор", admin: "Администратор фермы", support: "Инженер поддержки" };

export default function OperatorsPage() {
  const [selectedId, setSelectedId] = useState("max");
  const [roleOverrides, setRoleOverrides] = useState<Record<string, OperatorRole>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [dialog, setDialog] = useState<Dialog>(null);
  const [nextRole, setNextRole] = useState<OperatorRole>("operator");
  const [reason, setReason] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invites, setInvites] = useState(0);
  const [auditEntries, setAuditEntries] = useState<string[]>(["14:12 · Максим назначен на смену B", "09:16 · Support вошёл через WireGuard"]);

  const selected = operators.find((person) => person.id === selectedId) ?? operators[1];
  const role = roleOverrides[selected.id] ?? selected.role;
  const completed = progress[selected.id] ?? selected.completedSteps;
  const destructiveAllowed = completed === onboardingSteps.length && role !== "support";
  const selectedSteps = onboardingSteps.map((step, index) => ({ ...step, complete: index < completed }));

  function openRoleDialog() { setNextRole(role); setReason(""); setDialog("role"); }
  function saveRole() {
    if (!reason.trim()) return;
    setRoleOverrides((current) => ({ ...current, [selected.id]: nextRole }));
    setAuditEntries((current) => [`сейчас · ${selected.name}: ${roleLabels[role]} → ${roleLabels[nextRole]} · ${reason}`, ...current]);
    setDialog(null);
  }
  function completeNext() {
    if (completed >= onboardingSteps.length) return;
    const step = onboardingSteps[completed];
    setProgress((current) => ({ ...current, [selected.id]: completed + 1 }));
    setAuditEntries((current) => [`сейчас · ${selected.name} завершил «${step.title}»`, ...current]);
  }
  function sendInvite() {
    if (!inviteName.trim()) return;
    setInvites((count) => count + 1); setAuditEntries((current) => [`сейчас · приглашён ${inviteName}`, ...current]); setInviteName(""); setDialog(null);
  }

  return <div className={styles.page}>
    <div className={styles.mainColumn}>
      <Surface className={styles.hero}>
        <div className={styles.heroStats} aria-label="Состояние команды"><article><strong>{operators.length}</strong><span>активных</span></article><article><strong>3</strong><span>роли MVP</span></article><article><strong>{invites}</strong><span>приглашений</span></article></div>
        <div className={styles.heroActions}><button type="button" onClick={() => setDialog("audit")}><FileClock />Аудит действий</button><button type="button" onClick={() => setDialog("invite")}><Plus />Пригласить человека</button></div>
      </Surface>

      <Surface className={styles.workspace}>
        <section className={styles.teamSection}>
          <header className={styles.teamHeader}><div><Users /><span><h2>Команда</h2><small>Сотрудники и сервисный доступ</small></span></div><div className={styles.teamPolicy}><RadioTower /><span><strong>Support через WireGuard</strong><small>Диагностика Edge доступна только внутри защищённого контура</small></span></div></header>
          <div className={styles.peopleList}>{operators.map((person) => {
            const currentRole = roleOverrides[person.id] ?? person.role;
            const currentProgress = progress[person.id] ?? person.completedSteps;
            return <button className={`${styles.person} ${selected.id === person.id ? styles.personSelected : ""}`} type="button" onClick={() => setSelectedId(person.id)} aria-pressed={selected.id === person.id} key={person.id}>
              <span className={styles.personTop}><i>{person.initials}</i><em><span />{person.status === "active" ? "в сети" : person.status}</em></span>
              <span className={styles.personIdentity}><strong>{person.name}</strong><small>{roleLabels[currentRole]}</small></span>
              <span className={styles.personProgress}><span><b>Допуск</b><small>{currentProgress === 6 ? "завершён" : `${currentProgress} из 6 сценариев`}</small></span><strong>{currentProgress}<small>/6</small></strong></span>
              <span className={styles.personProgressTrack}><i style={{ width: `${currentProgress / onboardingSteps.length * 100}%` }} /></span>
              <ChevronRight />
            </button>;
          })}</div>
        </section>

        <section className={styles.learningStage}>
          <header><div><span className={styles.roleBadge}>{role === "operator" ? <UserCheck /> : role === "admin" ? <UserCog /> : <Wrench />}{roleLabels[role]}</span><h2>Путь допуска</h2><p>{selected.name} · {completed} из 6 производственных сценариев подтверждены</p></div><div className={styles.progressNumber}><strong>{completed}</strong><span>/ 6</span></div></header>
          <div className={styles.progressTrack}><i style={{ width: `${completed / 6 * 100}%` }} /></div>
          <div className={styles.learningPath}>{selectedSteps.map((step, index) => <article className={`${step.complete ? styles.stepComplete : ""} ${index === completed ? styles.stepCurrent : ""}`} key={step.id}><i>{step.complete ? <Check /> : index + 1}</i><span><small>{step.domain}</small><strong>{step.title}</strong><em>{step.detail}</em></span>{index < onboardingSteps.length - 1 ? <ArrowRight /> : null}</article>)}</div>
          <div className={styles.nextLesson}>{completed < 6 ? <><div><GraduationCap /><span><small>СЛЕДУЮЩИЙ СЦЕНАРИЙ</small><strong>{onboardingSteps[completed].title}</strong><em>{onboardingSteps[completed].detail}</em></span></div><button type="button" onClick={completeNext}><CheckCircle2 />Завершить mock-сценарий</button></> : <><div><ShieldCheck /><span><small>ONBOARDING ЗАВЕРШЁН</small><strong>Самостоятельная смена разрешена</strong><em>Все подтверждения остаются в аудите.</em></span></div><button type="button" onClick={() => setProgress((current) => ({ ...current, [selected.id]: 4 }))}><RotateCcw />Сбросить mock</button></>}</div>
        </section>
      </Surface>

      <Surface className={styles.permissionMap}>
        <div className={styles.sectionHead}><div><KeyRound /><span><strong>Матрица без лишнего</strong><small>доступ к производственным действиям, не к пунктам меню</small></span></div><span>MVP · 3 роли</span></div>
        <div className={styles.permissionTable}><header><span>Домен действия</span><strong>Оператор</strong><strong>Администратор</strong><strong>Поддержка</strong></header>{rolePermissions.map((row) => <article key={row.domain}><span>{row.domain}</span><b>{row.operator}</b><b>{row.admin}</b><b>{row.support}</b></article>)}</div>
      </Surface>
    </div>

    <aside className={styles.rail}>
      <Surface className={styles.profileCard}>
        <div className={styles.profileTop}><i>{selected.initials}</i><span>{selected.status}</span></div><h2>{selected.name}</h2><p>{selected.lastSeen}</p><dl><div><dt>Роль</dt><dd>{roleLabels[role]}</dd></div><div><dt>Onboarding</dt><dd>{completed} / 6</dd></div><div><dt>Контур</dt><dd>{selected.wireguard ? "WireGuard" : "Ферма"}</dd></div></dl><button type="button" onClick={openRoleDialog}><Settings2 />Изменить роль</button>
      </Surface>
      <Surface className={`${styles.accessCard} ${destructiveAllowed ? styles.accessAllowed : ""}`}>
        <div className={styles.accessTop}>{destructiveAllowed ? <ShieldCheck /> : <LockKeyhole />}<span>{destructiveAllowed ? "ДОПУСК АКТИВЕН" : "ОБУЧЕНИЕ ОБЯЗАТЕЛЬНО"}</span></div><h2>{destructiveAllowed ? "Деструктивные действия доступны" : "Деструктивные действия заблокированы"}</h2><p>{destructiveAllowed ? "Cancel, исключение из ночи и подтверждение остановки доступны с отдельным human confirmation." : "Нужно завершить сценарии «Зарядить ночь» и «Деструктивные команды»."}</p><div><article><AlertTriangle /><span><strong>Cancel печати</strong><small>{destructiveAllowed ? "human confirmation" : "onboarding"}</small></span></article><article><LockKeyhole /><span><strong>Исключить из ночи</strong><small>{destructiveAllowed ? "human confirmation" : "onboarding"}</small></span></article></div>
      </Surface>
      <Surface className={styles.auditCard}><div className={styles.sectionHead}><div><ClipboardCheck /><span><strong>Последнее в аудите</strong><small>{auditEntries.length} событий локально</small></span></div></div><p>{auditEntries[0]}</p><button type="button" onClick={() => setDialog("audit")}>Открыть журнал <ArrowRight /></button></Surface>
    </aside>

    {dialog ? createPortal(<div className={styles.dialogBackdrop} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="operator-dialog-title"><button className={styles.dialogClose} type="button" onClick={() => setDialog(null)} aria-label="Закрыть"><X /></button><div className={styles.dialogIcon}>{dialog === "role" ? <UserCog /> : dialog === "invite" ? <UserRound /> : <FileClock />}</div><h2 id="operator-dialog-title">{dialog === "role" ? "Изменить роль" : dialog === "invite" ? "Пригласить человека" : "Аудит действий"}</h2>{dialog === "role" ? <><p>Изменение сохранит инициатора, прежнюю роль, новое значение и причину.</p><label>Новая роль<select value={nextRole} onChange={(event) => setNextRole(event.target.value as OperatorRole)}><option value="operator">Оператор</option><option value="admin">Администратор фермы</option><option value="support">Инженер поддержки</option></select></label><label>Причина<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Например: отвечает за закрытие смены" /></label><button className={styles.dialogPrimary} type="button" disabled={!reason.trim()} onClick={saveRole}>Подтвердить изменение</button></> : dialog === "invite" ? <><p>Mock-приглашение без отправки письма и создания реальной учётной записи.</p><label>Имя<input value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Имя и фамилия" /></label><button className={styles.dialogPrimary} type="button" disabled={!inviteName.trim()} onClick={sendInvite}>Создать mock-приглашение</button></> : <div className={styles.auditList}>{auditEntries.map((entry) => <article key={entry}>{entry}</article>)}</div>}</section></div>, document.body) : null}
  </div>;
}
