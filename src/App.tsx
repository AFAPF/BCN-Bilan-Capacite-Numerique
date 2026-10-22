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
  return <div className="app-shell">
    <header className="topbar"><Brand /><span className="local-chip"><i aria-hidden="true" /> Données locales</span></header>
    <main className="dashboard">
      <section className="dashboard-hero">
        <div className="hero-copy"><p className="eyebrow">Tableau de bord</p><h1>Passations BCN</h1><p>Crée un dossier, lance une évaluation et retrouve les bilans enregistrés sur cet appareil.</p></div>
        <div className="hero-stats" aria-label="Résumé des passations"><span><strong>{workspace.participants.length}</strong><small>Dossier{workspace.participants.length > 1 ? "s" : ""}</small></span><span><strong>{workspace.assessments.length}</strong><small>Passation{workspace.assessments.length > 1 ? "s" : ""}</small></span><span className="hero-local"><strong>Local</strong><small>Stockage</small></span></div>
        <span className="hero-shape hero-shape-one" aria-hidden="true" /><span className="hero-shape hero-shape-two" aria-hidden="true" />
      </section>
      <EvaluationApp workspace={workspace} onChange={onWorkspaceChange} />
    </main>
    <footer><span>BCN {workspace.appVersion} · Bilan de Connaissance Numérique</span><span>Créé par FOURCADE Arnaud © 2026</span></footer>
  </div>;
}

function errorMessage(error: unknown) { return error instanceof Error ? error.message : "Une erreur inattendue est survenue."; }
