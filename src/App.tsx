import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Workspace } from "./domain";
import { requestPersistentStorage, vaultExists } from "./storage";
import { UnlockDelayedError, vaultService } from "./vault";

const AUTO_LOCK_MS = 30 * 60 * 1000;

export default function App() {
  const [phase, setPhase] = useState<"loading" | "setup" | "locked" | "open">("loading");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [message, setMessage] = useState("");
  const lastActivity = useRef(0);

  useEffect(() => {
    void vaultExists().then((exists) => setPhase(exists ? "locked" : "setup")).catch((error: unknown) => {
      setMessage(errorMessage(error));
      setPhase("setup");
    });
  }, []);

  const lock = useCallback(async () => {
    try {
      await vaultService.lock();
    } finally {
      setWorkspace(null);
      setPhase("locked");
      setMessage("Coffre verrouillé. La clé a été retirée de la mémoire.");
    }
  }, []);

  useEffect(() => {
    if (phase !== "open") return;
    lastActivity.current = Date.now();
    const activity = () => { lastActivity.current = Date.now(); };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "focus"];
    events.forEach((event) => window.addEventListener(event, activity, { passive: true }));
    const timer = window.setInterval(() => {
      if (Date.now() - lastActivity.current >= AUTO_LOCK_MS) void lock();
    }, 15_000);
    return () => {
      events.forEach((event) => window.removeEventListener(event, activity));
      window.clearInterval(timer);
    };
  }, [lock, phase]);

  if (phase === "loading") return <Loading />;
  if (phase === "setup") return <Setup onCreated={(value) => { setWorkspace(value); setPhase("open"); }} message={message} />;
  if (phase === "locked") return <Unlock onUnlocked={(value) => { lastActivity.current = Date.now(); setWorkspace(value); setPhase("open"); setMessage(""); }} message={message} />;
  if (!workspace) return null;
  return <WorkspaceView workspace={workspace} onLock={() => void lock()} onWorkspaceChange={setWorkspace} />;
}

function Brand() {
  return <div className="brand" aria-label="BCN"><span className="brand-mark">B</span><span><strong>BCN</strong><small>Bilan des capacités numériques</small></span></div>;
}

function Loading() {
  return <main className="centered"><Brand /><p role="status">Ouverture du stockage local…</p></main>;
}

function Setup({ onCreated, message }: { onCreated: (workspace: Workspace) => void; message: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(message);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password !== String(form.get("confirmation") ?? "")) { setError("Les deux phrases secrètes ne correspondent pas."); setBusy(false); return; }
    try {
      const persistence = await requestPersistentStorage();
      onCreated(await vaultService.create(password, String(form.get("label") ?? ""), String(form.get("name") ?? ""), persistence));
    } catch (cause) { setError(errorMessage(cause)); setBusy(false); }
  }

  return <main className="auth-layout">
    <section className="intro-panel"><Brand /><p className="eyebrow">Première ouverture</p><h1>Votre espace de travail reste sur cet appareil.</h1><p>BCN chiffre le contenu avant de l’enregistrer. La phrase secrète n’est ni stockée ni récupérable.</p><div className="privacy-note"><span aria-hidden="true">●</span> Aucun dossier ni bilan n’est envoyé sur Internet.</div></section>
    <section className="auth-card" aria-labelledby="setup-title"><h2 id="setup-title">Créer le coffre local</h2><p className="muted">Utilisez uniquement des données fictives pendant la construction.</p>
      <form onSubmit={submit}>
        <label>Nom du professionnel<input name="name" autoComplete="name" maxLength={80} required /></label>
        <label>Nom du coffre<input name="label" defaultValue="BCN — poste principal" maxLength={80} required /></label>
        <label>Phrase secrète<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={256} required /><small>12 caractères minimum. Conservez-la dans un endroit sûr.</small></label>
        <label>Confirmer la phrase secrète<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={256} required /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? "Création et chiffrement…" : "Créer le coffre"}</button>
      </form>
    </section>
  </main>;
}

function Unlock({ onUnlocked, message }: { onUnlocked: (workspace: Workspace) => void; message: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(message);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { onUnlocked(await vaultService.unlock(String(new FormData(event.currentTarget).get("password") ?? ""))); }
    catch (cause) { setError(cause instanceof UnlockDelayedError ? cause.message : errorMessage(cause)); setBusy(false); }
  }
  return <main className="centered"><div className="unlock-card"><Brand /><p className="eyebrow">Coffre local</p><h1>Déverrouiller BCN</h1><form onSubmit={submit}><label>Phrase secrète<input autoFocus name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy ? "Déchiffrement…" : "Déverrouiller"}</button></form><p className="microcopy">Après cinq échecs, les tentatives sont temporairement ralenties.</p></div></main>;
}

function WorkspaceView({ workspace, onLock, onWorkspaceChange }: { workspace: Workspace; onLock: () => void; onWorkspaceChange: (value: Workspace) => void }) {
  const [notice, setNotice] = useState("");

  async function backup() {
    try {
      const { json, hash } = await vaultService.exportBackup();
      const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `BCN-sauvegarde-${new Date().toISOString().slice(0, 10)}.bcn.json`; anchor.click();
      URL.revokeObjectURL(url);
      if (vaultService.current) onWorkspaceChange({ ...vaultService.current });
      setNotice(`Sauvegarde chiffrée créée et vérifiée (${hash.slice(0, 10)}…).`);
    } catch (cause) { setNotice(errorMessage(cause)); }
  }

  async function inspectBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const json = await file.text();
      const candidate = await vaultService.verifyBackup(json);
      if (!window.confirm(`Sauvegarde valide du ${new Date(candidate.exportedAt).toLocaleString("fr-FR")}\n\nLa restauration remplacera entièrement le coffre présent sur cet appareil. Continuer ?`)) {
        setNotice("Sauvegarde valide. Restauration annulée, aucune donnée modifiée.");
        return;
      }
      const password = window.prompt("Saisissez la phrase secrète de cette sauvegarde pour la vérifier :");
      if (!password) { setNotice("Restauration annulée, aucune donnée modifiée."); return; }
      const restored = await vaultService.restoreBackup(json, password);
      onWorkspaceChange({ ...restored });
      setNotice("Sauvegarde vérifiée, déchiffrée et restaurée avec succès.");
    } catch (cause) { setNotice(errorMessage(cause)); }
    event.target.value = "";
  }

  return <div className="app-shell">
    <header className="topbar"><Brand /><div className="top-actions"><span className="user-chip">{workspace.profile.displayName}</span><button className="secondary" onClick={onLock}>Verrouiller</button></div></header>
    <main className="dashboard">
      <div className="heading-row"><div><p className="eyebrow">Espace professionnel</p><h1>Bonjour {workspace.profile.displayName}</h1><p className="muted">Le socle sécurisé de BCN est opérationnel.</p></div><span className="status-pill"><span aria-hidden="true">●</span> Coffre ouvert</span></div>
      {notice && <div className="notice" role="status">{notice}</div>}
      <section className="milestone"><div><span className="step">Incrément 01</span><h2>Fondations locales prêtes</h2><p>Cette version qualifie le stockage et le fonctionnement hors connexion avant d’intégrer les épreuves.</p></div><div className="progress-ring" aria-label="1 lot sur 8"><strong>1/8</strong><small>lots</small></div></section>
      <section className="card-grid" aria-label="État technique">
        <article className="card"><span className="card-icon lock-icon" aria-hidden="true">◆</span><h2>Coffre chiffré</h2><p>AES‑256‑GCM, clé enveloppée par une phrase secrète et PBKDF2‑SHA‑256.</p><span className="ok">Opérationnel</span></article>
        <article className="card"><span className="card-icon" aria-hidden="true">↧</span><h2>Stockage local</h2><p>Persistance transactionnelle IndexedDB. Statut : <strong>{storageLabel(workspace.storagePersistence)}</strong>.</p><span className="ok">Aucun cloud</span></article>
        <article className="card"><span className="card-icon" aria-hidden="true">⌁</span><h2>Mode hors ligne</h2><p>L’application installée met en cache son interface sur cet appareil.</p><span className="ok">PWA active</span></article>
      </section>
      <section className="backup-panel"><div><p className="eyebrow">Continuité</p><h2>Sauvegarde du coffre</h2><p>Le fichier contient le coffre déjà chiffré. Conservez-le sur un support local distinct et maîtrisé.</p></div><div className="backup-actions"><button className="primary" onClick={() => void backup()}>Télécharger une sauvegarde</button><label className="file-button">Restaurer une sauvegarde<input type="file" accept=".json,.bcn" onChange={(event) => void inspectBackup(event)} /></label></div></section>
      <section className="next-panel"><div><span className="step muted-step">Prochain incrément</span><h2>Dossiers fictifs et parcours professionnel</h2></div><p>Les données nominatives et les épreuves resteront désactivées jusqu’à leur implémentation et leur qualification.</p></section>
    </main>
    <footer><span>BCN {workspace.appVersion}</span><span>Dernière ouverture : {new Date(workspace.lastOpenedAt).toLocaleString("fr-FR")}</span></footer>
  </div>;
}

function storageLabel(status: Workspace["storagePersistence"]) { return status === "granted" ? "persistant" : status === "denied" ? "non garanti" : "inconnu"; }
function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Une erreur inattendue est survenue."; }
