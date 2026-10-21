import { useEffect, useState, type FormEvent } from "react";
import type { Workspace } from "./domain";
import { requestPersistentStorage, vaultExists, workspaceExists } from "./storage";
import { UnlockDelayedError, vaultService } from "./vault";
import EvaluationApp from "./EvaluationApp";

export default function App() {
  const [phase, setPhase] = useState<"loading" | "welcome" | "legacy" | "open">("loading");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void (async () => {
      try {
        if (await workspaceExists()) {
          setWorkspace(await vaultService.openLocal());
          setPhase("welcome");
          return;
        }
        if (await vaultExists()) {
          setPhase("legacy");
          return;
        }
        const persistence = await requestPersistentStorage();
        setWorkspace(await vaultService.createLocal("BCN — appareil local", "FOURCADE Arnaud", persistence));
        setPhase("welcome");
      } catch (error) {
        setMessage(errorMessage(error));
        setPhase("legacy");
      }
    })();
  }, []);

  if (phase === "loading") return <Loading />;
  if (phase === "legacy") return <LegacyMigration onReady={(value) => { setWorkspace(value); setPhase("welcome"); setMessage(""); }} message={message} />;
  if (phase === "welcome" && workspace) return <Welcome onStart={() => setPhase("open")} />;
  if (!workspace) return null;
  return <WorkspaceView workspace={workspace} onWorkspaceChange={setWorkspace} />;
}

function Brand() {
  return <div className="brand" aria-label="BCN — Bilan de Connaissance Numérique"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>BCN</strong><small>Bilan de Connaissance Numérique</small></span></div>;
}

function Loading() {
  return <main className="centered"><Brand /><p role="status">Ouverture du stockage local…</p></main>;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <main className="welcome-page"><div className="welcome-orb welcome-orb-one" /><div className="welcome-orb welcome-orb-two" /><header><Brand /><span className="welcome-version">Version expérimentale</span></header><section className="welcome-content"><p className="eyebrow">Évaluation des connaissances numériques</p><h1>Observer et comprendre l’autonomie numérique de l’élève.</h1><p className="welcome-lead">BCN propose des situations simulées pour évaluer la compréhension des interfaces, des fichiers, du traitement de texte, d’Internet, de la communication et de la sécurité numérique.</p><div className="welcome-actions"><button className="primary welcome-start" onClick={onStart}>Commencer</button><span>Ordinateur · tablette · smartphone</span></div></section><footer className="welcome-footer"><span>Les données et les bilans restent sur cet appareil.</span><strong>Créé par FOURCADE Arnaud © 2026</strong></footer></main>;
}

function LegacyMigration({ onReady, message }: { onReady: (workspace: Workspace) => void; message: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(message);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const workspace = await vaultService.migrateToLocal(String(new FormData(event.currentTarget).get("password") ?? ""));
      onReady(workspace);
    }
    catch (cause) { setError(cause instanceof UnlockDelayedError ? cause.message : errorMessage(cause)); setBusy(false); }
  }
  return <main className="centered"><div className="unlock-card"><Brand /><p className="eyebrow">Mise à jour unique</p><h1>Conserver les données existantes</h1><p>Entre une dernière fois l’ancienne phrase secrète. Elle sera ensuite supprimée et BCN s’ouvrira directement.</p><form onSubmit={submit}><label>Ancienne phrase secrète<input autoFocus name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="error" role="alert">{error}</p>}<button className="primary" disabled={busy}>{busy ? "Mise à jour…" : "Conserver mes données"}</button></form></div></main>;
}

function WorkspaceView({ workspace, onWorkspaceChange }: { workspace: Workspace; onWorkspaceChange: (value: Workspace) => void }) {
  const [notice, setNotice] = useState("");

  async function backup() {
    try {
      const { json, hash } = await vaultService.exportBackup();
      const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `BCN-sauvegarde-${new Date().toISOString().slice(0, 10)}.bcn.json`; anchor.click();
      URL.revokeObjectURL(url);
      if (vaultService.current) onWorkspaceChange({ ...vaultService.current });
      setNotice(`Sauvegarde locale créée et vérifiée (${hash.slice(0, 10)}…).`);
    } catch (cause) { setNotice(errorMessage(cause)); }
  }

  async function inspectBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const json = await file.text();
      const candidate = await vaultService.verifyBackup(json);
      if (!window.confirm(`Sauvegarde valide du ${new Date(candidate.exportedAt).toLocaleString("fr-FR")}\n\nLa restauration remplacera entièrement les données BCN présentes sur cet appareil. Continuer ?`)) {
        setNotice("Sauvegarde valide. Restauration annulée, aucune donnée modifiée.");
        return;
      }
      let restored: Workspace;
      if (candidate.version === 2) {
        restored = await vaultService.restoreBackup(json);
      } else {
        const password = window.prompt("Cette sauvegarde provient d’une ancienne version protégée. Saisissez son ancienne phrase secrète :");
        if (!password) { setNotice("Restauration annulée, aucune donnée modifiée."); return; }
        restored = await vaultService.restoreBackup(json, password);
        await vaultService.migrateToLocal(password);
      }
      onWorkspaceChange({ ...restored });
      setNotice("Sauvegarde vérifiée et restaurée avec succès.");
    } catch (cause) { setNotice(errorMessage(cause)); }
    event.target.value = "";
  }

  return <div className="app-shell">
    <header className="topbar"><Brand /><div className="top-actions"><span className="user-chip">{workspace.profile.displayName}</span><span className="local-chip">Données locales</span></div></header>
    <main className="dashboard">
      <div className="heading-row"><div><p className="eyebrow">Espace d’évaluation</p><h1>Bonjour {workspace.profile.displayName}</h1><p className="muted">Sélectionne un dossier ou commence une nouvelle passation BCN.</p></div><span className="status-pill"><span aria-hidden="true">●</span> Stockage local</span></div>
      {notice && <div className="notice" role="status">{notice}</div>}
      <EvaluationApp workspace={workspace} onChange={onWorkspaceChange} />
      <section className="backup-panel"><div><p className="eyebrow">Continuité</p><h2>Sauvegarde locale</h2><p>Télécharge régulièrement une copie des données et conserve-la sur un support local distinct.</p></div><div className="backup-actions"><button className="primary" onClick={() => void backup()}>Télécharger une sauvegarde</button><label className="file-button">Restaurer une sauvegarde<input type="file" accept=".json,.bcn" onChange={(event) => void inspectBackup(event)} /></label></div></section>
    </main>
    <footer><span>BCN {workspace.appVersion} · Bilan de Connaissance Numérique</span><span>Créé par FOURCADE Arnaud © 2026</span></footer>
  </div>;
}

function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Une erreur inattendue est survenue."; }
