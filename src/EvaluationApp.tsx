import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { APP_VERSION, type Assessment, type ItemResult, type Participant, type SchoolLevel, type TaskCode, type TaskResult, type Workspace } from "./domain";
import { vaultService } from "./vault";

const TASKS: { code: TaskCode; title: string; description: string }[] = [
  { code: "typing_copy", title: "Copie au clavier", description: "Vitesse, exactitude et corrections" },
  { code: "pointing_click", title: "Clic simple", description: "10 cibles de tailles variées" },
  { code: "pointing_double", title: "Double-clic", description: "Intervalle et reconnaissance" },
  { code: "pointing_drag", title: "Glisser-déposer", description: "Dépôt du centre dans la cible" },
  { code: "visual_search", title: "Repérage visuel", description: "15 icônes en trois phases" },
  { code: "keyboard_shortcuts", title: "Raccourcis de base", description: "Deux fenêtres et huit actions guidées" },
  { code: "file_management", title: "Fichiers et dossiers", description: "7 actions dans un explorateur simulé" },
  { code: "comprehension", title: "Compréhension", description: "6 consignes numériques" },
  { code: "navigation", title: "Navigation", description: "4 situations simulées" },
];

type View = { page: "home" } | { page: "new-participant" } | { page: "select"; participantId: string } | { page: "run"; assessmentId: string } | { page: "report"; assessmentId: string };

export default function EvaluationApp({ workspace, onChange }: { workspace: Workspace; onChange: (workspace: Workspace) => void }) {
  const [view, setView] = useState<View>({ page: "home" });
  const [saving, setSaving] = useState(false);

  async function update(mutator: (current: Workspace) => void) {
    const current = vaultService.current;
    if (!current) throw new Error("Le coffre est verrouillé.");
    setSaving(true);
    try {
      mutator(current);
      await vaultService.save();
      onChange(structuredClone(current));
    } finally { setSaving(false); }
  }

  if (view.page === "new-participant") return <ParticipantForm saving={saving} onCancel={() => setView({ page: "home" })} onSubmit={async (participant) => { await update((current) => current.participants.push(participant)); setView({ page: "select", participantId: participant.id }); }} />;
  if (view.page === "select") {
    const participant = workspace.participants.find((item) => item.id === view.participantId);
    if (!participant) return null;
    return <TaskSelection participant={participant} saving={saving} onCancel={() => setView({ page: "home" })} onStart={async (selectedTasks) => {
      const assessment: Assessment = { id: crypto.randomUUID(), participantId: participant.id, status: "active", selectedTasks, results: [], createdAt: new Date().toISOString(), completedAt: null };
      await update((current) => current.assessments.push(assessment));
      setView({ page: "run", assessmentId: assessment.id });
    }} />;
  }
  if (view.page === "run") {
    const assessment = workspace.assessments.find((item) => item.id === view.assessmentId);
    const participant = assessment ? workspace.participants.find((item) => item.id === assessment.participantId) : undefined;
    if (!assessment || !participant) return null;
    return <AssessmentRunner participant={participant} assessment={assessment} onExit={() => setView({ page: "home" })} onResult={async (result, finished) => {
      await update((current) => {
        const target = current.assessments.find((item) => item.id === assessment.id);
        if (!target) return;
        target.results = [...target.results.filter((item) => item.taskCode !== result.taskCode), result];
        if (finished) { target.status = "completed"; target.completedAt = new Date().toISOString(); }
      });
      if (finished) setView({ page: "report", assessmentId: assessment.id });
    }} />;
  }
  if (view.page === "report") {
    const assessment = workspace.assessments.find((item) => item.id === view.assessmentId);
    const participant = assessment ? workspace.participants.find((item) => item.id === assessment.participantId) : undefined;
    if (!assessment || !participant) return null;
    return <Report participant={participant} assessment={assessment} onBack={() => setView({ page: "home" })} />;
  }

  return <section className="evaluation-home">
    <div className="section-heading"><div><p className="eyebrow">Version d’essai {APP_VERSION}</p><h2>Passations locales</h2><p>Crée un dossier fictif, choisis les tâches et teste le parcours complet.</p></div><button className="primary" onClick={() => setView({ page: "new-participant" })}>+ Nouveau dossier</button></div>
    {workspace.participants.length === 0 ? <div className="empty-state"><span aria-hidden="true">◎</span><h3>Aucun dossier</h3><p>Commence avec une identité fictive pour découvrir le programme.</p><button className="primary" onClick={() => setView({ page: "new-participant" })}>Créer un dossier fictif</button></div> :
      <div className="participant-list">{workspace.participants.map((participant) => {
        const assessments = workspace.assessments.filter((item) => item.participantId === participant.id);
        return <article className="participant-row" key={participant.id}><div className="avatar">{participant.firstName[0]}{participant.lastName[0]}</div><div><h3>{participant.firstName} {participant.lastName}</h3><p>{participant.schoolLevel} · {participant.ageYears} ans {participant.ageMonths} mois · {assessments.length} passation(s)</p></div><div className="row-actions"><button className="secondary" onClick={() => setView({ page: "select", participantId: participant.id })}>Nouvelle passation</button>{assessments.at(-1) && <button className="text-button" onClick={() => setView({ page: assessments.at(-1)?.status === "completed" ? "report" : "run", assessmentId: assessments.at(-1)!.id })}>{assessments.at(-1)?.status === "completed" ? "Voir le bilan" : "Reprendre"}</button>}</div></article>;
      })}</div>}
  </section>;
}

function ParticipantForm({ saving, onCancel, onSubmit }: { saving: boolean; onCancel: () => void; onSubmit: (participant: Participant) => Promise<void> }) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = new FormData(event.currentTarget);
    const firstName = String(data.get("firstName") ?? "").trim().normalize("NFC");
    const lastName = String(data.get("lastName") ?? "").trim().normalize("NFC");
    const ageYears = Number(data.get("ageYears")); const ageMonths = Number(data.get("ageMonths"));
    if (!firstName || !lastName || ageYears < 8 || ageYears > 18 || ageMonths < 0 || ageMonths > 11) { setError("Vérifie le nom et l’âge saisis."); return; }
    await onSubmit({ id: crypto.randomUUID(), firstName, lastName, schoolLevel: String(data.get("schoolLevel")) as SchoolLevel, ageYears, ageMonths, createdAt: new Date().toISOString() });
  }
  return <section className="flow-card"><FlowHeader step="Dossier" title="Créer un dossier d’essai" onBack={onCancel} /><div className="warning-strip">Pour le moment, utilise uniquement une identité fictive.</div><form onSubmit={(event) => void submit(event)} className="two-column-form"><label>Prénom fictif<input name="firstName" required maxLength={80} /></label><label>Nom fictif<input name="lastName" required maxLength={80} /></label><label>Niveau<select name="schoolLevel" defaultValue="CM1">{["CM1","CM2","6E","5E","4E","3E"].map((level) => <option key={level}>{level}</option>)}</select></label><label>Âge<div className="age-fields"><input name="ageYears" type="number" min="8" max="18" defaultValue="10" required /><span>ans</span><input name="ageMonths" type="number" min="0" max="11" defaultValue="0" required /><span>mois</span></div></label>{error && <p className="error full" role="alert">{error}</p>}<div className="form-actions full"><button type="button" className="secondary" onClick={onCancel}>Annuler</button><button className="primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer et continuer"}</button></div></form></section>;
}

function TaskSelection({ participant, saving, onCancel, onStart }: { participant: Participant; saving: boolean; onCancel: () => void; onStart: (tasks: TaskCode[]) => Promise<void> }) {
  const [selected, setSelected] = useState<TaskCode[]>(TASKS.map((task) => task.code));
  function toggle(code: TaskCode) { setSelected((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]); }
  return <section className="flow-card"><FlowHeader step="Préparation" title={`Tâches pour ${participant.firstName}`} onBack={onCancel} /><p className="lead">Chaque tâche est indépendante. Pour un essai rapide, tu peux n’en sélectionner qu’une.</p><div className="task-grid">{TASKS.map((task) => <label className={`task-choice ${selected.includes(task.code) ? "selected" : ""}`} key={task.code}><input type="checkbox" checked={selected.includes(task.code)} onChange={() => toggle(task.code)} /><span><strong>{task.title}</strong><small>{task.description}</small></span></label>)}</div><div className="form-actions"><button className="secondary" onClick={onCancel}>Annuler</button><button className="primary" disabled={saving || selected.length === 0} onClick={() => void onStart(selected)}>{saving ? "Préparation…" : `Commencer (${selected.length})`}</button></div></section>;
}

function AssessmentRunner({ participant, assessment, onExit, onResult }: { participant: Participant; assessment: Assessment; onExit: () => void; onResult: (result: TaskResult, finished: boolean) => Promise<void> }) {
  const index = assessment.results.length;
  const code = assessment.selectedTasks[index];
  const [started, setStarted] = useState(false);
  if (!code) return null;
  const info = TASKS.find((task) => task.code === code)!;
  async function complete(result: TaskResult) { await onResult(result, index + 1 >= assessment.selectedTasks.length); setStarted(false); }
  if (!started) return <section className="flow-card task-intro"><button className="text-button" onClick={onExit}>← Quitter et reprendre plus tard</button><div className="task-progress"><span style={{ width: `${(index / assessment.selectedTasks.length) * 100}%` }} /></div><p className="eyebrow">Tâche {index + 1} sur {assessment.selectedTasks.length}</p><h2>{info.title}</h2><p>{instructionFor(code)}</p><div className="training-box"><strong>Essai d’entraînement</strong><p>Explique la consigne à {participant.firstName}. Cette version d’essai démarre directement quand vous êtes prêts.</p></div><button className="primary large-button" onClick={() => setStarted(true)}>Démarrer la tâche</button></section>;
  if (code === "typing_copy") return <TypingTask onComplete={(result) => void complete(result)} />;
  if (code === "visual_search") return <VisualSearchTask onComplete={(result) => void complete(result)} />;
  if (code === "keyboard_shortcuts") return <KeyboardShortcutsTask onComplete={(result) => void complete(result)} />;
  if (code === "file_management") return <FileManagementTask onComplete={(result) => void complete(result)} />;
  if (code === "comprehension") return <ChoiceTask code={code} items={COMPREHENSION_ITEMS} onComplete={(result) => void complete(result)} />;
  if (code === "navigation") return <ChoiceTask code={code} items={NAVIGATION_ITEMS} onComplete={(result) => void complete(result)} />;
  return <PointingTask mode={code} onComplete={(result) => void complete(result)} />;
}

function TypingTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const model = "Le matin, Lina prépare son cartable. Elle vérifie ses cahiers, range sa trousse et allume son ordinateur pour consulter le travail de la journée.";
  const [text, setText] = useState(""); const [seconds, setSeconds] = useState(300); const started = useRef(0); const textRef = useRef(""); const finished = useRef(false);
  const finish = useCallback(() => { if (finished.current) return; finished.current = true; const durationMs = Math.max(1000, Date.now() - started.current); const typed = words(textRef.current); const reference = words(model); const correct = typed.filter((word, index) => normalize(word) === normalize(reference[index] ?? "")).length; onComplete({ taskCode: "typing_copy", completedAt: new Date().toISOString(), items: [{ success: correct === reference.length, durationMs }], metrics: { motsSaisis: typed.length, motsCorrects: correct, dureeSecondes: Math.round(durationMs / 1000), motsParMinute: round(typed.length / (durationMs / 60000)), motsCorrectsParMinute: round(correct / (durationMs / 60000)) } }); }, [onComplete]);
  useEffect(() => { started.current = Date.now(); }, []);
  useEffect(() => { const timer = window.setInterval(() => setSeconds((value) => { if (value <= 1) { window.clearInterval(timer); return 0; } return value - 1; }), 1000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { if (seconds === 0) finish(); }, [finish, seconds]);
  return <section className="test-screen"><TestTop title="Copie au clavier" counter={`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2,"0")}`} /><div className="copy-layout"><article className="copy-model"><p>{model}</p></article><label className="typing-zone">Recopie le texte ici<textarea autoFocus value={text} onChange={(event) => { textRef.current = event.target.value; setText(event.target.value); }} spellCheck={false} /></label></div><button className="primary finish-button" onClick={finish}>Terminer maintenant</button></section>;
}

const TARGETS = [
  { x: 16, y: 22, size: 8 }, { x: 78, y: 24, size: 16 }, { x: 50, y: 70, size: 24 }, { x: 22, y: 76, size: 8 }, { x: 82, y: 68, size: 16 },
  { x: 48, y: 18, size: 8 }, { x: 68, y: 48, size: 24 }, { x: 30, y: 48, size: 16 }, { x: 88, y: 42, size: 8 }, { x: 52, y: 48, size: 24 },
];

function PointingTask({ mode, onComplete }: { mode: "pointing_click" | "pointing_double" | "pointing_drag"; onComplete: (result: TaskResult) => void }) {
  const [index, setIndex] = useState(0); const [items, setItems] = useState<ItemResult[]>([]); const appeared = useRef(0); const board = useRef<HTMLDivElement>(null); const [drag, setDrag] = useState({ x: 8, y: 78, active: false });
  useEffect(() => { appeared.current = performance.now(); }, [index]);
  function record(success: boolean, reason?: string) { const next = [...items, { success, durationMs: Math.round(performance.now() - appeared.current), ...(reason ? { failureReason: reason } : {}) }]; if (index === 9) onComplete(makePointingResult(mode, next)); else { setItems(next); setIndex((value) => value + 1); setDrag({ x: 8, y: 78, active: false }); } }
  function boardActivation(event: React.MouseEvent) { if (mode === "pointing_drag") return; const hit = (event.target as HTMLElement).closest(".point-target"); if (mode === "pointing_click" && event.type === "click") record(Boolean(hit), hit ? undefined : "hors cible"); if (mode === "pointing_double" && event.type === "dblclick") record(Boolean(hit), hit ? undefined : "hors cible"); }
  function dragMove(event: React.PointerEvent) { if (!drag.active || !board.current) return; const rect = board.current.getBoundingClientRect(); setDrag({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100, active: true }); }
  function dragEnd() { if (!drag.active || !board.current) return; const target = TARGETS[index]!; const rect = board.current.getBoundingClientRect(); const dx = ((drag.x - target.x) / 100) * rect.width; const dy = ((drag.y - target.y) / 100) * rect.height; const radius = ((target.size / 2) / 25.4) * 96; record(Math.hypot(dx, dy) <= radius, "dépôt hors cible"); }
  const target = TARGETS[index]!;
  return <section className="test-screen"><TestTop title={TASKS.find((task) => task.code === mode)!.title} counter={`${index + 1}/10`} /><p className="test-instruction">{mode === "pointing_click" ? "Clique une fois sur le cercle." : mode === "pointing_double" ? "Double-clique sur le cercle." : "Fais glisser le carré plein au centre du cercle."}</p><div ref={board} className={`point-board ${mode}`} onClick={boardActivation} onDoubleClick={boardActivation} onPointerMove={dragMove} onPointerUp={dragEnd}><div className="point-target" style={{ left: `${target.x}%`, top: `${target.y}%`, width: `${target.size}mm`, height: `${target.size}mm` }} />{mode === "pointing_drag" && <div className="drag-object" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrag((value) => ({ ...value, active: true })); }} style={{ left: `${drag.x}%`, top: `${drag.y}%` }} />}</div></section>;
}

const SEARCH_ICONS = [
  { id: "start", symbol: "⊞", label: "Menu Démarrer", prompt: "Clique sur l’icône qui ouvre le menu Démarrer." },
  { id: "folder", symbol: "📁", label: "Explorateur de fichiers", prompt: "Clique sur l’icône qui ouvre l’explorateur de fichiers." },
  { id: "search", symbol: "🔍", label: "Rechercher", prompt: "Clique sur l’icône qui permet de rechercher sur l’ordinateur." },
  { id: "settings", symbol: "⚙️", label: "Paramètres", prompt: "Clique sur l’icône qui ouvre les paramètres de l’ordinateur." },
  { id: "trash", symbol: "🗑️", label: "Corbeille", prompt: "Clique sur l’icône de la corbeille." },
  { id: "bold", symbol: "𝐁", label: "Gras", prompt: "Clique sur l’icône qui met le texte en gras." },
  { id: "underline", symbol: "U̲", label: "Souligner", prompt: "Clique sur l’icône qui souligne le texte." },
  { id: "align", symbol: "≡", label: "Aligner", prompt: "Clique sur l’icône qui permet d’aligner le texte." },
  { id: "list", symbol: "☷", label: "Liste à puces", prompt: "Clique sur l’icône qui crée une liste à puces." },
  { id: "undo", symbol: "↶", label: "Annuler", prompt: "Clique sur l’icône qui annule la dernière action." },
  { id: "save", symbol: "💾", label: "Enregistrer", prompt: "Clique sur l’icône qui permet d’enregistrer." },
  { id: "print", symbol: "🖨️", label: "Imprimer", prompt: "Clique sur l’icône qui permet d’imprimer." },
  { id: "download", symbol: "⬇️", label: "Télécharger", prompt: "Clique sur l’icône qui permet de télécharger un fichier." },
  { id: "upload", symbol: "⬆️", label: "Importer", prompt: "Clique sur l’icône qui permet d’importer un fichier." },
  { id: "attachment", symbol: "📎", label: "Pièce jointe", prompt: "Clique sur l’icône qui permet d’ajouter une pièce jointe." },
  { id: "redo", symbol: "↷", label: "Rétablir", prompt: "" },
  { id: "document", symbol: "📄", label: "Document", prompt: "" },
  { id: "cut", symbol: "✂️", label: "Couper", prompt: "" },
  { id: "mail", symbol: "✉️", label: "Message", prompt: "" },
  { id: "image", symbol: "🖼️", label: "Image", prompt: "" },
  { id: "back", symbol: "←", label: "Retour", prompt: "" },
  { id: "forward", symbol: "→", label: "Suivant", prompt: "" },
  { id: "close", symbol: "✕", label: "Fermer", prompt: "" },
  { id: "favorite", symbol: "⭐", label: "Favori", prompt: "" },
] as const;
const SEARCH_PHASES = [
  { title: "Navigation Windows", targetIds: ["start", "folder", "search", "settings", "trash"] },
  { title: "Traitement de texte", targetIds: ["bold", "underline", "align", "list", "undo"] },
  { title: "Fichiers et actions courantes", targetIds: ["save", "print", "download", "upload", "attachment"] },
] as const;
const SEARCH_DENSITIES = [8, 12, 16, 12, 16, 8, 12, 16, 12, 16, 8, 12, 16, 12, 16] as const;
function VisualSearchTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [index, setIndex] = useState(0); const [items, setItems] = useState<ItemResult[]>([]); const started = useRef(0); const phase = SEARCH_PHASES[Math.floor(index / 5)]!; const targetId = phase.targetIds[index % 5]!; const target = SEARCH_ICONS.find((icon) => icon.id === targetId)!; const shown = useMemo(() => { const size = SEARCH_DENSITIES[index]!; const base = SEARCH_ICONS.slice(0, size); if (!base.some((icon) => icon.id === target.id)) base[size - 1] = target; const offset = (index * 3) % size; return [...base.slice(offset), ...base.slice(0, offset)]; }, [index, target]);
  useEffect(() => { started.current = performance.now(); }, [index]);
  function answer(iconId: string, timeStamp: number) { const success = iconId === target.id; const next = [...items, { success, durationMs: Math.round(timeStamp - started.current), ...(success ? {} : { failureReason: "sélection incorrecte" }) }]; if (index === 14) onComplete({ ...makeCountResult("visual_search", next), metrics: { reussites: next.filter((item) => item.success).length, erreurs: next.filter((item) => !item.success).length, phases: 3 } }); else { setItems(next); setIndex((value) => value + 1); } }
  function speak() { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(target.prompt)); }
  return <section className="test-screen"><TestTop title={`Repérage visuel · ${phase.title}`} counter={`${index + 1}/15`} /><div className="phase-tabs">{SEARCH_PHASES.map((item, phaseIndex) => <span className={phaseIndex === Math.floor(index / 5) ? "active" : phaseIndex < Math.floor(index / 5) ? "done" : ""} key={item.title}>{phaseIndex + 1}. {item.title}</span>)}</div><div className="search-prompt"><span><strong>{target.prompt}</strong></span><button className="secondary" onClick={speak}>🔊 Répéter</button></div><div className="mock-window"><div className="window-bar"><i/><i/><i/><span>{phase.title}</span></div><div className="icon-grid">{shown.map((icon) => <button key={icon.id} aria-label={`Icône ${icon.label}`} title={icon.label} onClick={(event) => answer(icon.id, event.timeStamp)}><span aria-hidden="true">{icon.symbol}</span></button>)}</div></div></section>;
}

const SHORTCUT_STEPS = [
  { kind: "key", window: "source", chord: "Ctrl + A", key: "a", instruction: "Dans la fenêtre 1, sélectionne tout le texte." },
  { kind: "key", window: "source", chord: "Ctrl + C", key: "c", instruction: "Copie maintenant le texte sélectionné." },
  { kind: "click", window: "destination", chord: "Clic", key: "", instruction: "Clique dans la fenêtre 2 pour l’activer." },
  { kind: "key", window: "destination", chord: "Ctrl + V", key: "v", instruction: "Colle le texte dans la fenêtre 2." },
  { kind: "key", window: "destination", chord: "Ctrl + A", key: "a", instruction: "Sélectionne tout le texte de la fenêtre 2." },
  { kind: "key", window: "destination", chord: "Ctrl + X", key: "x", instruction: "Coupe le texte sélectionné." },
  { kind: "key", window: "destination", chord: "Ctrl + Z", key: "z", instruction: "Annule la dernière action pour retrouver le texte." },
  { kind: "key", window: "destination", chord: "Ctrl + Y", key: "y", instruction: "Rétablis l’action qui vient d’être annulée." },
] as const;

function KeyboardShortcutsTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const sourceText = "La classe prépare un exposé sur les planètes."; const [destinationText, setDestinationText] = useState(""); const [activeWindow, setActiveWindow] = useState<"source" | "destination">("source"); const [stepIndex, setStepIndex] = useState(0); const [items, setItems] = useState<ItemResult[]>([]); const [errors, setErrors] = useState(0); const [sourceSelected, setSourceSelected] = useState(false); const [destinationSelected, setDestinationSelected] = useState(false); const [clipboard, setClipboard] = useState(""); const started = useRef(0); const capture = useRef<HTMLDivElement>(null); const step = SHORTCUT_STEPS[stepIndex]!;
  useEffect(() => { started.current = performance.now(); capture.current?.focus(); }, [stepIndex]);
  function advance(timeStamp: number) { const next = [...items, { success: true, durationMs: Math.round(timeStamp - started.current) }]; if (stepIndex === SHORTCUT_STEPS.length - 1) onComplete({ taskCode: "keyboard_shortcuts", completedAt: new Date().toISOString(), items: next, metrics: { raccourcisReussis: 7, changementFenetre: 1, erreursActions: errors } }); else { setItems(next); setStepIndex((value) => value + 1); } }
  function activateWindow(windowName: "source" | "destination", timeStamp: number) { setActiveWindow(windowName); capture.current?.focus(); if (step.kind === "click" && step.window === windowName) advance(timeStamp); else if (step.kind === "click") setErrors((value) => value + 1); }
  function keyAction(event: React.KeyboardEvent) { event.preventDefault(); if (step.kind !== "key" || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== step.key || activeWindow !== step.window) { setErrors((value) => value + 1); return; } if (step.key === "a") { if (activeWindow === "source") setSourceSelected(true); else setDestinationSelected(true); } if (step.key === "c") setClipboard(sourceText); if (step.key === "v") setDestinationText(clipboard); if (step.key === "x") { setClipboard(destinationText); setDestinationText(""); setDestinationSelected(false); } if (step.key === "z") setDestinationText(clipboard); if (step.key === "y") setDestinationText(""); advance(event.timeStamp); }
  return <section className="test-screen"><TestTop title="Raccourcis de base" counter={`${stepIndex + 1}/8`} /><div className="shortcut-instruction"><p className="eyebrow">Action demandée</p><h2>{step.instruction}</h2><kbd>{step.chord}</kbd><p>Les autres actions sont enregistrées comme erreurs, mais tu peux réessayer.</p></div><div ref={capture} tabIndex={0} className="shortcut-workspace" onKeyDown={keyAction}><button className={`sim-window ${activeWindow === "source" ? "active" : ""}`} onClick={(event) => activateWindow("source", event.timeStamp)}><span className="sim-title">Fenêtre 1 · Texte source</span><p className={sourceSelected ? "selected-text" : ""}>{sourceText}</p></button><button className={`sim-window ${activeWindow === "destination" ? "active" : ""}`} onClick={(event) => activateWindow("destination", event.timeStamp)}><span className="sim-title">Fenêtre 2 · Document de travail</span><p className={destinationSelected ? "selected-text" : ""}>{destinationText || "Clique ici au moment demandé."}</p></button></div><div className="shortcut-status"><span>Fenêtre active : <strong>{activeWindow === "source" ? "1" : "2"}</strong></span><span>Erreurs : <strong>{errors}</strong></span></div></section>;
}

const FILE_STEPS = [
  "Ouvre le dossier « Documents ».",
  "Crée un dossier nommé « Travail scolaire ».",
  "Renomme « Texte sans titre.docx » en « Exposé planètes.docx ».",
  "Déplace « Exposé planètes.docx » dans « Travail scolaire ».",
  "Recherche le fichier « Emploi du temps.pdf ».",
  "Supprime le fichier « Brouillon.txt ».",
  "Enregistre le document ouvert sous le nom « Compte rendu.docx » dans « Travail scolaire ».",
] as const;

type FileAction = "create" | "rename" | "move" | "delete" | "save" | null;
type ExplorerEntry = { name: string; kind: "folder" | "file"; icon: string };

function FileManagementTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [items, setItems] = useState<ItemResult[]>([]);
  const [errors, setErrors] = useState(0);
  const [helps, setHelps] = useState(0);
  const [location, setLocation] = useState<"Accueil" | "Documents" | "Recherche">("Accueil");
  const [entries, setEntries] = useState<ExplorerEntry[]>([
    { name: "Texte sans titre.docx", kind: "file", icon: "📄" },
    { name: "Brouillon.txt", kind: "file", icon: "📝" },
    { name: "Emploi du temps.pdf", kind: "file", icon: "📕" },
    { name: "Photo de classe.jpg", kind: "file", icon: "🖼️" },
  ]);
  const [selected, setSelected] = useState("");
  const [pending, setPending] = useState<FileAction>(null);
  const [nameValue, setNameValue] = useState("");
  const [destination, setDestination] = useState("Travail scolaire");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const started = useRef(0);

  const homeEntries: ExplorerEntry[] = [
    { name: "Documents", kind: "folder", icon: "📁" },
    { name: "Images", kind: "folder", icon: "📁" },
    { name: "Téléchargements", kind: "folder", icon: "📁" },
  ];
  const visibleEntries = location === "Accueil" ? homeEntries : location === "Recherche" ? entries.filter((entry) => normalize(entry.name).includes(normalize(search))) : entries;

  useEffect(() => { started.current = performance.now(); }, [stepIndex]);

  function wrong() { setErrors((value) => value + 1); setNotice("Cette action ne permet pas encore de passer à l’étape suivante."); }
  function applyExpected(index: number) {
    if (index === 0) setLocation("Documents");
    if (index === 1) setEntries((current) => current.some((entry) => entry.name === "Travail scolaire") ? current : [...current, { name: "Travail scolaire", kind: "folder", icon: "📁" }]);
    if (index === 2) setEntries((current) => current.map((entry) => entry.name === "Texte sans titre.docx" ? { ...entry, name: "Exposé planètes.docx" } : entry));
    if (index === 3) setEntries((current) => current.filter((entry) => entry.name !== "Exposé planètes.docx"));
    if (index === 4) { setSearch(""); setLocation("Documents"); }
    if (index === 5) { setLocation("Documents"); setEntries((current) => current.filter((entry) => entry.name !== "Brouillon.txt")); }
    if (index === 6) setEntries((current) => [...current, { name: "Compte rendu.docx", kind: "file", icon: "📄" }]);
    setSelected(""); setPending(null); setNameValue(""); setNotice("");
  }
  function complete(success: boolean, timeStamp: number, reason?: string) {
    const next = [...items, { success, durationMs: Math.round(timeStamp - started.current), ...(reason ? { failureReason: reason } : {}) }];
    applyExpected(stepIndex);
    if (stepIndex === FILE_STEPS.length - 1) {
      onComplete({ taskCode: "file_management", completedAt: new Date().toISOString(), items: next, metrics: { actionsAutonomes: next.filter((item) => item.success).length, aides: helps + (success ? 0 : 1), erreursActions: errors, dureeSecondes: Math.round(next.reduce((total, item) => total + item.durationMs, 0) / 1000) } });
    } else { setItems(next); setStepIndex((value) => value + 1); }
  }
  function openEntry(entry: ExplorerEntry, timeStamp: number) {
    if (stepIndex === 0 && entry.name === "Documents") complete(true, timeStamp); else wrong();
  }
  function launch(action: Exclude<FileAction, null>) {
    const valid = (stepIndex === 1 && action === "create") || (stepIndex === 2 && action === "rename" && selected === "Texte sans titre.docx") || (stepIndex === 3 && action === "move" && selected === "Exposé planètes.docx") || (stepIndex === 5 && action === "delete" && selected === "Brouillon.txt") || (stepIndex === 6 && action === "save");
    if (!valid) { wrong(); return; }
    setPending(action);
    setNameValue(action === "rename" ? selected : action === "save" ? "Document sans titre.docx" : "");
    setNotice("");
  }
  function validateAction(timeStamp: number) {
    const valid = (pending === "create" && nameValue.trim() === "Travail scolaire") ||
      (pending === "rename" && nameValue.trim() === "Exposé planètes.docx") ||
      (pending === "move" && destination === "Travail scolaire") ||
      pending === "delete" ||
      (pending === "save" && nameValue.trim() === "Compte rendu.docx" && destination === "Travail scolaire");
    if (valid) complete(true, timeStamp); else wrong();
  }
  function runSearch(timeStamp: number) {
    if (stepIndex === 4 && normalize(search).includes("emploidutemps")) { setLocation("Recherche"); complete(true, timeStamp); } else wrong();
  }
  function signalHelp(timeStamp: number) { setHelps((value) => value + 1); complete(false, timeStamp, "besoin d’aide"); }

  return <section className="test-screen file-task"><TestTop title="Gestion des fichiers et dossiers" counter={`${stepIndex + 1}/7`} />
    <div className="file-task-prompt"><div><p className="eyebrow">Action demandée</p><h2>{FILE_STEPS[stepIndex]}</h2></div><button className="secondary" onClick={(event) => signalHelp(event.timeStamp)}>Signaler une aide</button></div>
    <div className="explorer-window">
      <div className="explorer-toolbar"><button aria-label="Retour à l’accueil" onClick={() => { setLocation("Accueil"); setSelected(""); }}>←</button><span className="address-bar">📂 {location}</span><label className="explorer-search"><span className="sr-only">Rechercher</span><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runSearch(event.timeStamp); }} placeholder="Rechercher" /><button onClick={(event) => runSearch(event.timeStamp)} aria-label="Lancer la recherche">🔍</button></label></div>
      <div className="explorer-actions"><button onClick={() => launch("create")}>＋ Nouveau dossier</button><button onClick={() => launch("rename")}>✏️ Renommer</button><button onClick={() => launch("move")}>↗ Déplacer</button><button onClick={() => launch("delete")}>🗑️ Supprimer</button><button className="save-document" onClick={() => launch("save")}>💾 Enregistrer le document</button></div>
      <div className="explorer-body"><nav><strong>Accès rapide</strong><button onClick={() => setLocation("Accueil")}>🏠 Accueil</button><button onClick={() => setLocation("Documents")}>📄 Documents</button><button>🖼️ Images</button><button>⬇️ Téléchargements</button></nav><main><p className="explorer-hint">Sélection : un clic · Ouvrir : double-clic</p><div className="file-grid">{visibleEntries.map((entry) => <button key={entry.name} className={selected === entry.name ? "selected" : ""} onClick={() => setSelected(entry.name)} onDoubleClick={(event) => openEntry(entry, event.timeStamp)}><span aria-hidden="true">{entry.icon}</span><small>{entry.name}</small></button>)}</div>{visibleEntries.length === 0 && <p className="empty-folder">Aucun élément</p>}</main></div>
    </div>
    {pending && <div className="file-dialog" role="dialog" aria-modal="true" aria-label="Action sur le fichier"><div><h3>{pending === "create" ? "Nouveau dossier" : pending === "rename" ? "Renommer" : pending === "move" ? "Déplacer vers" : pending === "delete" ? "Supprimer ce fichier ?" : "Enregistrer sous"}</h3>{(pending === "create" || pending === "rename" || pending === "save") && <label>Nom<input autoFocus value={nameValue} onChange={(event) => setNameValue(event.target.value)} /></label>}{(pending === "move" || pending === "save") && <label>Destination<select value={destination} onChange={(event) => setDestination(event.target.value)}><option>Travail scolaire</option><option>Images</option><option>Téléchargements</option></select></label>}<div className="form-actions"><button className="secondary" onClick={() => setPending(null)}>Annuler</button><button className="primary" onClick={(event) => validateAction(event.timeStamp)}>{pending === "delete" ? "Confirmer la suppression" : pending === "save" ? "Enregistrer" : "Valider"}</button></div></div></div>}
    <div className="file-task-status"><span>Erreurs d’action : <strong>{errors}</strong></span><span>Aides : <strong>{helps}</strong></span>{notice && <span role="status">{notice}</span>}</div>
  </section>;
}

interface ChoiceItem { prompt: string; choices: string[]; correct: number }
const COMPREHENSION_ITEMS: ChoiceItem[] = [
  { prompt: "Sélectionne l’action qui permet d’enregistrer un document.", choices: ["Enregistrer", "Imprimer", "Fermer"], correct: 0 },
  { prompt: "Quel bouton permet généralement de revenir en arrière ?", choices: ["Annuler", "Supprimer", "Partager"], correct: 0 },
  { prompt: "Où clique-t-on pour saisir du texte ?", choices: ["Dans la zone de texte", "Sur l’horloge", "Sur le fond"], correct: 0 },
  { prompt: "Que signifie une icône en forme de poubelle ?", choices: ["Supprimer", "Télécharger", "Agrandir"], correct: 0 },
  { prompt: "Comment choisir un seul élément dans une liste ?", choices: ["Cliquer dessus", "Éteindre l’écran", "Débrancher la souris"], correct: 0 },
  { prompt: "Quel bouton ferme généralement une fenêtre ?", choices: ["×", "+", "?"], correct: 0 },
];
const NAVIGATION_ITEMS: ChoiceItem[] = [
  { prompt: "Tu veux retrouver un document enregistré. Quelle action fais-tu d’abord ?", choices: ["Ouvrir le gestionnaire de fichiers", "Éteindre l’ordinateur", "Changer le volume"], correct: 0 },
  { prompt: "Le fichier est dans le dossier « Français ». Que fais-tu ?", choices: ["Ouvrir le dossier Français", "Supprimer le dossier", "Ouvrir la calculatrice"], correct: 0 },
  { prompt: "Tu dois renommer le fichier. Quelle action convient ?", choices: ["Clic droit puis Renommer", "Imprimer", "Actualiser la page"], correct: 0 },
  { prompt: "Tu t’es trompé de dossier. Comment revenir ?", choices: ["Utiliser la flèche Retour", "Créer dix dossiers", "Fermer sans enregistrer"], correct: 0 },
];

function ChoiceTask({ code, items: questions, onComplete }: { code: "comprehension" | "navigation"; items: ChoiceItem[]; onComplete: (result: TaskResult) => void }) {
  const [index, setIndex] = useState(0); const [results, setResults] = useState<ItemResult[]>([]); const started = useRef(0); const item = questions[index]!;
  useEffect(() => { started.current = performance.now(); }, [index]);
  function answer(choice: number, timeStamp: number) { const success = choice === item.correct; const next = [...results, { success, durationMs: Math.round(timeStamp - started.current), ...(success ? {} : { failureReason: "réponse incorrecte" }) }]; if (index === questions.length - 1) onComplete(makeCountResult(code, next)); else { setResults(next); setIndex((value) => value + 1); } }
  return <section className="test-screen"><TestTop title={code === "comprehension" ? "Compréhension" : "Navigation"} counter={`${index + 1}/${questions.length}`} /><div className="question-card"><p className="eyebrow">Consigne</p><h2>{item.prompt}</h2><div className="choice-list">{item.choices.map((choice, choiceIndex) => <button key={choice} onClick={(event) => answer(choiceIndex, event.timeStamp)}>{choice}</button>)}</div></div></section>;
}

function Report({ participant, assessment, onBack }: { participant: Participant; assessment: Assessment; onBack: () => void }) {
  return <section className="flow-card report"><FlowHeader step="Bilan expérimental" title={`${participant.firstName} ${participant.lastName}`} onBack={onBack} /><div className="report-meta"><span>{participant.schoolLevel}</span><span>{participant.ageYears} ans {participant.ageMonths} mois</span><span>{new Date(assessment.completedAt ?? assessment.createdAt).toLocaleDateString("fr-FR")}</span></div><div className="report-warning">Résultats descriptifs de la version d’essai — aucune note globale ni interprétation diagnostique.</div><div className="result-table">{assessment.results.map((result) => { const successes = result.items.filter((item) => item.success).length; return <article key={result.taskCode}><div><h3>{TASKS.find((task) => task.code === result.taskCode)?.title}</h3><p>{successes} réussite(s) sur {result.items.length}</p></div><div className="metrics">{Object.entries(result.metrics).slice(0, 4).map(([key, value]) => <span key={key}><small>{metricLabel(key)}</small><strong>{value}</strong></span>)}</div></article>; })}</div><div className="form-actions"><button className="secondary" onClick={onBack}>Retour aux dossiers</button><button className="primary" onClick={() => window.print()}>Imprimer / enregistrer en PDF</button></div></section>;
}

function FlowHeader({ step, title, onBack }: { step: string; title: string; onBack: () => void }) { return <header className="flow-header"><button className="back-button" onClick={onBack} aria-label="Retour">←</button><div><p className="eyebrow">{step}</p><h2>{title}</h2></div></header>; }
function TestTop({ title, counter }: { title: string; counter: string }) { return <header className="test-top"><span>BCN</span><strong>{title}</strong><span>{counter}</span></header>; }
function instructionFor(code: TaskCode) { const instructions: Record<TaskCode,string> = { typing_copy: "Recopier un texte pendant cinq minutes, sans aide à la correction.", pointing_click: "Cliquer ou toucher dix cibles.", pointing_double: "Double-cliquer ou double-toucher dix cibles.", pointing_drag: "Déplacer dix objets au centre de leur cible.", visual_search: "Repérer quinze icônes réparties entre Windows, traitement de texte et actions courantes.", keyboard_shortcuts: "Réaliser les raccourcis copier, couper, coller, tout sélectionner, annuler et rétablir dans deux fenêtres simulées.", file_management: "Réaliser sept actions dans un explorateur de fichiers simulé : créer, renommer, déplacer, rechercher, supprimer et enregistrer.", comprehension: "Répondre à six consignes numériques.", navigation: "Résoudre quatre situations de navigation." }; return instructions[code]; }
function makeCountResult(taskCode: TaskCode, items: ItemResult[]): TaskResult { return { taskCode, completedAt: new Date().toISOString(), items, metrics: { reussites: items.filter((item) => item.success).length, erreurs: items.filter((item) => !item.success).length } }; }
function makePointingResult(taskCode: TaskCode, items: ItemResult[]): TaskResult { const successfulTimes = items.filter((item) => item.success).map((item) => item.durationMs).sort((a,b) => a-b); return { ...makeCountResult(taskCode, items), metrics: { reussites: successfulTimes.length, erreurs: items.length - successfulTimes.length, tempsMedianMs: successfulTimes.length ? successfulTimes[Math.floor(successfulTimes.length / 2)]! : 0 } }; }
function words(value: string) { return value.trim() ? value.trim().split(/\s+/u) : []; }
function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase(); }
function round(value: number) { return Math.round(value * 10) / 10; }
function metricLabel(value: string) { return ({ reussites: "Réussites", erreurs: "Erreurs", phases: "Phases", raccourcisReussis: "Raccourcis réussis", changementFenetre: "Changement de fenêtre", erreursActions: "Actions incorrectes", actionsAutonomes: "Actions autonomes", aides: "Aides", tempsMedianMs: "Temps médian (ms)", motsSaisis: "Mots saisis", motsCorrects: "Mots corrects", motsParMinute: "Mots/min", motsCorrectsParMinute: "Mots corrects/min", dureeSecondes: "Durée (s)" } as Record<string,string>)[value] ?? value; }
