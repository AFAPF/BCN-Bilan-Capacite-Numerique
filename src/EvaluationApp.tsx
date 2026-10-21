import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { APP_VERSION, type Assessment, type ItemResult, type Participant, type SchoolLevel, type TaskCode, type TaskResult, type Workspace } from "./domain";
import { vaultService } from "./vault";

const TASKS: { code: TaskCode; title: string; description: string }[] = [
  { code: "interface_knowledge", title: "Mission interface", description: "Retrouver les commandes principales" },
  { code: "files_knowledge", title: "Mission explorateur", description: "Suivre cinq chemins et ouvrir le bon fichier" },
  { code: "text_knowledge", title: "Mission traitement de texte", description: "Reconnaître les outils d’édition" },
  { code: "web_knowledge", title: "Mission Internet", description: "Choisir les commandes du navigateur" },
  { code: "communication_knowledge", title: "Mission messagerie", description: "Pièces jointes, réponses et envoi" },
  { code: "safety_knowledge", title: "Mission sécurité", description: "Reconnaître les protections et alertes" },
  { code: "problem_solving", title: "Mission dépannage", description: "Choisir l’outil adapté au problème" },
  { code: "accessibility_tools", title: "Mission adaptation", description: "Identifier les aides numériques" },
];

const LEGACY_TASK_TITLES: Partial<Record<TaskCode, string>> = {
  typing_copy: "Copie au clavier", pointing_click: "Clic simple", pointing_double: "Double-clic", pointing_drag: "Glisser-déposer", visual_search: "Repérage visuel", keyboard_shortcuts: "Raccourcis de base", file_management: "Gestion des fichiers et dossiers", comprehension: "Compréhension", navigation: "Navigation",
};

interface ChoiceItem { prompt: string; choices: string[]; correct: number }
const THEORY_BANKS = {
  interface_knowledge: [
    { prompt: "À quoi sert généralement une icône en forme de roue dentée ?", choices: ["Ouvrir les paramètres", "Imprimer", "Éteindre l’écran"], correct: 0 },
    { prompt: "Quel symbole ferme généralement une fenêtre ?", choices: ["＋", "×", "?"], correct: 1 },
    { prompt: "À quoi sert une barre de recherche ?", choices: ["Trouver un élément", "Augmenter le son", "Recharger la batterie"], correct: 0 },
    { prompt: "Une fenêtre masque une autre fenêtre. Que peut-on faire ?", choices: ["Changer de fenêtre", "Supprimer les deux", "Couper Internet"], correct: 0 },
    { prompt: "Que représente le plus souvent une icône en forme de maison ?", choices: ["L’accueil", "La corbeille", "Le volume"], correct: 0 },
  ],
  files_knowledge: [
    { prompt: "À quoi sert un dossier ?", choices: ["Ranger des fichiers", "Écrire un mot de passe", "Augmenter la luminosité"], correct: 0 },
    { prompt: "Tu veux conserver un document modifié. Quelle action choisis-tu ?", choices: ["Enregistrer", "Imprimer", "Actualiser"], correct: 0 },
    { prompt: "Quel nom permet de retrouver facilement un devoir ?", choices: ["Document1", "Devoir français 21 octobre", "Nouveau"], correct: 1 },
    { prompt: "Que se passe-t-il généralement quand on supprime un fichier ?", choices: ["Il va dans la corbeille", "Il est imprimé", "Il devient un dossier"], correct: 0 },
    { prompt: "Où faut-il enregistrer un travail demandé dans le dossier Français ?", choices: ["Dans Français", "Dans Images", "Dans la corbeille"], correct: 0 },
  ],
  text_knowledge: [
    { prompt: "Quelle commande permet de revenir sur la dernière modification ?", choices: ["Annuler", "Partager", "Télécharger"], correct: 0 },
    { prompt: "À quoi sert la commande Copier ?", choices: ["Dupliquer un contenu sans supprimer l’original", "Effacer le contenu", "Fermer le document"], correct: 0 },
    { prompt: "Quelle mise en forme fait ressortir un titre ?", choices: ["Le gras", "La corbeille", "Le mode avion"], correct: 0 },
    { prompt: "Avant de modifier seulement une phrase, que faut-il faire ?", choices: ["La sélectionner", "Éteindre l’appareil", "Créer un dossier"], correct: 0 },
    { prompt: "À quoi sert le correcteur orthographique ?", choices: ["Signaler certaines erreurs d’écriture", "Traduire toutes les pages", "Enregistrer automatiquement"], correct: 0 },
  ],
  web_knowledge: [
    { prompt: "Où saisit-on l’adresse d’un site Internet ?", choices: ["Dans la barre d’adresse", "Dans la corbeille", "Dans le réglage du son"], correct: 0 },
    { prompt: "Quel élément permet généralement d’ouvrir une autre page ?", choices: ["Un lien", "Une batterie", "Une horloge"], correct: 0 },
    { prompt: "Tu veux revenir à la page précédente. Quelle commande utilises-tu ?", choices: ["La flèche Retour", "Supprimer", "Imprimer"], correct: 0 },
    { prompt: "Que signifie télécharger un fichier ?", choices: ["Le recevoir sur l’appareil", "Le supprimer d’Internet", "Changer son nom"], correct: 0 },
    { prompt: "Dans une liste de résultats, quel choix est le plus fiable ?", choices: ["Un résultat correspondant précisément à la recherche", "La première publicité", "Le résultat le plus coloré"], correct: 0 },
  ],
  communication_knowledge: [
    { prompt: "À quoi sert une pièce jointe ?", choices: ["Ajouter un fichier à un message", "Bloquer l’écran", "Changer la police"], correct: 0 },
    { prompt: "Avant d’envoyer un message, que faut-il vérifier ?", choices: ["Le destinataire", "La luminosité", "La batterie de la souris"], correct: 0 },
    { prompt: "Que signifie Répondre à tous ?", choices: ["Répondre à tous les destinataires", "Supprimer tous les messages", "Partager sur Internet"], correct: 0 },
    { prompt: "Quel objet de message est le plus clair ?", choices: ["Devoir de mathématiques du 21 octobre", "Bonjour", "Important !!!"], correct: 0 },
    { prompt: "Que faire avant d’envoyer une photo d’une autre personne ?", choices: ["Vérifier qu’on peut la partager", "La publier immédiatement", "Modifier son nom"], correct: 0 },
  ],
  safety_knowledge: [
    { prompt: "Quel mot de passe est le plus solide ?", choices: ["123456", "azerty", "Une phrase longue et personnelle"], correct: 2 },
    { prompt: "Un inconnu demande ton mot de passe. Que fais-tu ?", choices: ["Je ne le donne pas", "Je l’envoie", "Je le publie"], correct: 0 },
    { prompt: "Un message annonce un cadeau et demande de cliquer très vite. Que fais-tu ?", choices: ["Je vérifie avant d’agir", "Je clique immédiatement", "Je donne mon adresse"], correct: 0 },
    { prompt: "Quelle information doit rester privée ?", choices: ["Un mot de passe", "Le titre d’un livre", "La météo"], correct: 0 },
    { prompt: "Que faire si un contenu en ligne met mal à l’aise ?", choices: ["En parler à un adulte de confiance", "Le repartager", "Répondre avec son adresse"], correct: 0 },
  ],
  problem_solving: [
    { prompt: "Une application ne répond plus. Quelle première réaction est raisonnable ?", choices: ["Attendre un instant puis essayer de la fermer", "Jeter l’appareil", "Supprimer tous les fichiers"], correct: 0 },
    { prompt: "Tu as supprimé du texte par erreur. Quelle commande peux-tu essayer ?", choices: ["Annuler", "Imprimer", "Partager"], correct: 0 },
    { prompt: "Le son ne fonctionne pas. Que vérifies-tu d’abord ?", choices: ["Le volume et le mode silencieux", "La corbeille", "Le nom du fichier"], correct: 0 },
    { prompt: "Une page Internet ne charge pas. Quelle vérification est utile ?", choices: ["La connexion Internet", "La couleur du fond", "La taille du clavier"], correct: 0 },
    { prompt: "Tu ne comprends pas un message d’erreur. Que fais-tu ?", choices: ["Je le lis et demande de l’aide si nécessaire", "Je clique partout", "Je donne mon mot de passe"], correct: 0 },
  ],
  accessibility_tools: [
    { prompt: "Quel outil permet d’agrandir ce qui est affiché ?", choices: ["Le zoom", "La corbeille", "Le téléchargement"], correct: 0 },
    { prompt: "À quoi sert la lecture vocale ?", choices: ["Lire un texte à voix haute", "Créer un dossier", "Éteindre Internet"], correct: 0 },
    { prompt: "À quoi sert la dictée vocale ?", choices: ["Transformer la parole en texte", "Agrandir les icônes", "Supprimer les messages"], correct: 0 },
    { prompt: "Quel réglage peut faciliter la lecture d’un texte peu visible ?", choices: ["Le contraste", "Le mode avion", "La corbeille"], correct: 0 },
    { prompt: "Quel outil peut proposer la suite d’un mot pendant la saisie ?", choices: ["La prédiction de mots", "L’imprimante", "La calculatrice"], correct: 0 },
  ],
} satisfies Record<string, ChoiceItem[]>;
type TheoryCode = keyof typeof THEORY_BANKS;

type IconName = "settings" | "home" | "search" | "close" | "windows" | "save" | "bold" | "list" | "undo" | "redo" | "back" | "refresh" | "download" | "link" | "attachment" | "send" | "reply" | "replyAll" | "mail" | "lock" | "shield" | "eyeOff" | "warning" | "trash" | "volume" | "wifi" | "help" | "zoom" | "microphone" | "contrast" | "textSize" | "folder" | "file";
interface IconChallenge { prompt: string; context: string; options: IconName[]; correct: IconName }
const ICON_LABELS: Record<IconName, string> = {
  settings: "Paramètres", home: "Accueil", search: "Rechercher", close: "Fermer", windows: "Fenêtres", save: "Enregistrer", bold: "Gras", list: "Liste à puces", undo: "Annuler", redo: "Rétablir", back: "Retour", refresh: "Actualiser", download: "Télécharger", link: "Lien", attachment: "Pièce jointe", send: "Envoyer", reply: "Répondre", replyAll: "Répondre à tous", mail: "Message", lock: "Verrouiller", shield: "Protection", eyeOff: "Masquer", warning: "Alerte", trash: "Supprimer", volume: "Volume", wifi: "Connexion Internet", help: "Aide", zoom: "Zoom", microphone: "Dictée vocale", contrast: "Contraste", textSize: "Taille du texte", folder: "Dossier", file: "Fichier",
};
const ICON_PATHS: Record<IconName, string[]> = {
  settings: ["M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z", "M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"],
  home: ["M3 11.5 12 4l9 7.5", "M5.5 10v10h13V10M9.5 20v-6h5v6"], search: ["M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14ZM16 16l5 5"], close: ["M5 5l14 14M19 5 5 19"], windows: ["M3 4h8v7H3zM13 4h8v7h-8zM3 13h8v7H3zM13 13h8v7h-8z"],
  save: ["M4 3h13l3 3v15H4z", "M8 3v6h8V3M8 21v-7h8v7"], bold: ["M7 4h6a4 4 0 0 1 0 8H7z", "M7 12h7a4 4 0 0 1 0 8H7z"], list: ["M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"], undo: ["M9 7 4 12l5 5", "M5 12h9a6 6 0 0 1 6 6"], redo: ["m15 7 5 5-5 5", "M19 12h-9a6 6 0 0 0-6 6"],
  back: ["m10 5-7 7 7 7", "M3 12h18"], refresh: ["M20 7v5h-5", "M4 17v-5h5", "M6.1 8A7 7 0 0 1 18.5 6L20 12M4 12l1.5 6A7 7 0 0 0 18 16"], download: ["M12 3v12", "m7 10 5 5 5-5", "M4 21h16"], link: ["M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1", "M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"],
  attachment: ["M8 12.5 14.5 6a3.5 3.5 0 1 1 5 5L10 20.5a5 5 0 0 1-7-7L13 3.5", "M6.5 15 16 5.5"], send: ["M3 11.5 21 3l-8.5 18-2-7.5z", "M10.5 13.5 21 3"], reply: ["m10 7-6 5 6 5", "M5 12h8a7 7 0 0 1 7 7"], replyAll: ["m8 7-5 5 5 5M13 7l-5 5 5 5", "M9 12h5a7 7 0 0 1 7 7"], mail: ["M3 5h18v14H3z", "m3 7 9 6 9-6"],
  lock: ["M6 10h12v11H6z", "M8 10V7a4 4 0 0 1 8 0v3"], shield: ["M12 3 20 6v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z", "m8.5 12 2.2 2.2 4.8-5"], eyeOff: ["M3 3l18 18", "M10.5 10.5a2.1 2.1 0 0 0 3 3", "M6.5 6.7C4.5 8 3 10 2 12c2.3 4.2 5.7 6 10 6 1.3 0 2.5-.2 3.5-.6M10 6.2A10 10 0 0 1 12 6c4.3 0 7.7 1.8 10 6a13 13 0 0 1-2.2 3.2"], warning: ["M12 3 2 21h20z", "M12 9v5M12 18h.01"], trash: ["M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"],
  volume: ["M4 10h4l5-4v12l-5-4H4z", "M16 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"], wifi: ["M3 9a14 14 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9.5 16.5a4 4 0 0 1 5 0M12 20h.01"], help: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M9.5 9a2.5 2.5 0 1 1 3.7 2.2c-1.2.7-1.2 1.3-1.2 2.3M12 18h.01"],
  zoom: ["M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15ZM16 16l5 5M10.5 7v7M7 10.5h7"], microphone: ["M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0z", "M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"], contrast: ["M12 22a10 10 0 1 0 0-20z", "M12 2v20"], textSize: ["M4 6V3h16v3M12 3v18M8 21h8"], folder: ["M3 6h7l2 2h9v12H3z"], file: ["M6 3h8l4 4v14H6z", "M14 3v5h5"],
};

const ICON_CHALLENGES: Record<Exclude<TheoryCode, "files_knowledge">, IconChallenge[]> = {
  interface_knowledge: [
    { context: "Écran d’accueil", prompt: "Trouve l’icône qui ouvre les paramètres.", options: ["home", "settings", "search", "windows"], correct: "settings" },
    { context: "Fenêtre ouverte", prompt: "Quelle icône permet de fermer la fenêtre ?", options: ["back", "close", "refresh", "home"], correct: "close" },
    { context: "Plusieurs applications ouvertes", prompt: "Quelle icône permet d’afficher ou de changer de fenêtre ?", options: ["windows", "folder", "settings", "trash"], correct: "windows" },
    { context: "Retrouver une application", prompt: "Quelle commande permet de lancer une recherche ?", options: ["search", "home", "close", "refresh"], correct: "search" },
    { context: "Navigation générale", prompt: "Quelle icône ramène généralement à l’accueil ?", options: ["back", "home", "windows", "settings"], correct: "home" },
  ],
  text_knowledge: [
    { context: "Document modifié", prompt: "Quelle icône permet d’enregistrer le travail ?", options: ["save", "download", "folder", "attachment"], correct: "save" },
    { context: "Mettre un titre en valeur", prompt: "Quelle icône applique le gras ?", options: ["textSize", "bold", "list", "contrast"], correct: "bold" },
    { context: "Organiser plusieurs idées", prompt: "Quelle icône crée une liste à puces ?", options: ["list", "bold", "redo", "textSize"], correct: "list" },
    { context: "Erreur de modification", prompt: "Quelle icône annule la dernière action ?", options: ["redo", "back", "undo", "refresh"], correct: "undo" },
    { context: "Action annulée par erreur", prompt: "Quelle icône rétablit l’action ?", options: ["undo", "redo", "refresh", "back"], correct: "redo" },
  ],
  web_knowledge: [
    { context: "Navigateur Internet", prompt: "Quelle icône revient à la page précédente ?", options: ["back", "undo", "home", "refresh"], correct: "back" },
    { context: "Page qui ne s’affiche pas correctement", prompt: "Quelle icône recharge la page ?", options: ["download", "redo", "refresh", "search"], correct: "refresh" },
    { context: "Récupérer un document", prompt: "Quelle icône télécharge le fichier sur l’appareil ?", options: ["attachment", "download", "save", "folder"], correct: "download" },
    { context: "Ouvrir une autre page", prompt: "Quelle icône représente généralement un lien ?", options: ["link", "attachment", "mail", "wifi"], correct: "link" },
    { context: "Trouver une information sur une page", prompt: "Quelle icône lance une recherche ?", options: ["zoom", "search", "refresh", "help"], correct: "search" },
  ],
  communication_knowledge: [
    { context: "Nouveau message", prompt: "Quelle icône ajoute un fichier au message ?", options: ["link", "attachment", "download", "folder"], correct: "attachment" },
    { context: "Message terminé", prompt: "Quelle icône permet de l’envoyer ?", options: ["mail", "reply", "send", "attachment"], correct: "send" },
    { context: "Message reçu", prompt: "Quelle icône répond seulement à l’expéditeur ?", options: ["replyAll", "reply", "send", "back"], correct: "reply" },
    { context: "Message adressé à plusieurs personnes", prompt: "Quelle icône répond à tous les destinataires ?", options: ["reply", "replyAll", "mail", "windows"], correct: "replyAll" },
    { context: "Boîte de réception", prompt: "Quelle icône représente un message électronique ?", options: ["mail", "file", "attachment", "link"], correct: "mail" },
  ],
  safety_knowledge: [
    { context: "Protéger l’accès", prompt: "Quelle icône indique qu’un élément est verrouillé ?", options: ["lock", "shield", "eyeOff", "warning"], correct: "lock" },
    { context: "Protection de l’appareil", prompt: "Quelle icône représente le mieux la sécurité ?", options: ["settings", "shield", "lock", "help"], correct: "shield" },
    { context: "Masquer un mot de passe", prompt: "Quelle icône indique que le contenu est caché ?", options: ["eyeOff", "close", "lock", "trash"], correct: "eyeOff" },
    { context: "Message potentiellement dangereux", prompt: "Quelle icône signale une alerte ?", options: ["help", "warning", "shield", "settings"], correct: "warning" },
    { context: "Supprimer une information sensible", prompt: "Quelle icône place généralement l’élément dans la corbeille ?", options: ["close", "trash", "back", "file"], correct: "trash" },
  ],
  problem_solving: [
    { context: "Texte supprimé par erreur", prompt: "Quelle commande faut-il essayer en premier ?", options: ["undo", "trash", "back", "redo"], correct: "undo" },
    { context: "Page bloquée ou incomplète", prompt: "Quelle commande peut la recharger ?", options: ["refresh", "download", "close", "search"], correct: "refresh" },
    { context: "Aucun son", prompt: "Quel réglage faut-il vérifier ?", options: ["wifi", "settings", "volume", "microphone"], correct: "volume" },
    { context: "Site inaccessible", prompt: "Quelle icône permet de vérifier la connexion sans fil ?", options: ["link", "wifi", "refresh", "home"], correct: "wifi" },
    { context: "Consigne ou erreur incomprise", prompt: "Quelle icône permet généralement d’obtenir de l’aide ?", options: ["warning", "settings", "help", "search"], correct: "help" },
  ],
  accessibility_tools: [
    { context: "Texte trop petit", prompt: "Quelle icône permet d’agrandir l’affichage ?", options: ["zoom", "search", "textSize", "contrast"], correct: "zoom" },
    { context: "Écouter un texte", prompt: "Quelle icône correspond à la lecture sonore ?", options: ["microphone", "volume", "mail", "wifi"], correct: "volume" },
    { context: "Écrire en parlant", prompt: "Quelle icône active la dictée vocale ?", options: ["volume", "microphone", "textSize", "attachment"], correct: "microphone" },
    { context: "Éléments peu visibles", prompt: "Quelle icône correspond au réglage du contraste ?", options: ["settings", "eyeOff", "contrast", "zoom"], correct: "contrast" },
    { context: "Lecture difficile", prompt: "Quelle icône permet de modifier la taille du texte ?", options: ["bold", "textSize", "zoom", "list"], correct: "textSize" },
  ],
};

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
  const info = taskInfo(code);
  async function complete(result: TaskResult) { await onResult(result, index + 1 >= assessment.selectedTasks.length); setStarted(false); }
  if (!started) return <section className="flow-card task-intro"><button className="text-button" onClick={onExit}>← Quitter et reprendre plus tard</button><div className="task-progress"><span style={{ width: `${(index / assessment.selectedTasks.length) * 100}%` }} /></div><p className="eyebrow">Tâche {index + 1} sur {assessment.selectedTasks.length}</p><h2>{info.title}</h2><p>{instructionFor(code)}</p><div className="training-box"><strong>Essai d’entraînement</strong><p>Explique la consigne à {participant.firstName}. Cette version d’essai démarre directement quand vous êtes prêts.</p></div><button className="primary large-button" onClick={() => setStarted(true)}>Démarrer la tâche</button></section>;
  if (code === "files_knowledge") return <ExplorerFindTask onComplete={(result) => void complete(result)} />;
  if (code in ICON_CHALLENGES) return <IconMissionTask code={code as Exclude<TheoryCode, "files_knowledge">} onComplete={(result) => void complete(result)} />;
  if (code === "typing_copy") return <TypingTask onComplete={(result) => void complete(result)} />;
  if (code === "visual_search") return <VisualSearchTask onComplete={(result) => void complete(result)} />;
  if (code === "keyboard_shortcuts") return <KeyboardShortcutsTask onComplete={(result) => void complete(result)} />;
  if (code === "file_management") return <FileManagementTask onComplete={(result) => void complete(result)} />;
  if (code === "comprehension") return <ChoiceTask code={code} items={COMPREHENSION_ITEMS} onComplete={(result) => void complete(result)} />;
  if (code === "navigation") return <ChoiceTask code={code} items={NAVIGATION_ITEMS} onComplete={(result) => void complete(result)} />;
  return <PointingTask mode={code as "pointing_click" | "pointing_double" | "pointing_drag"} onComplete={(result) => void complete(result)} />;
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
  return <section className="test-screen"><TestTop title={taskInfo(mode).title} counter={`${index + 1}/10`} /><p className="test-instruction">{mode === "pointing_click" ? "Clique une fois sur le cercle." : mode === "pointing_double" ? "Double-clique sur le cercle." : "Fais glisser le carré plein au centre du cercle."}</p><div ref={board} className={`point-board ${mode}`} onClick={boardActivation} onDoubleClick={boardActivation} onPointerMove={dragMove} onPointerUp={dragEnd}><div className="point-target" style={{ left: `${target.x}%`, top: `${target.y}%`, width: `${target.size}mm`, height: `${target.size}mm` }} />{mode === "pointing_drag" && <div className="drag-object" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrag((value) => ({ ...value, active: true })); }} style={{ left: `${drag.x}%`, top: `${drag.y}%` }} />}</div></section>;
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

function UiIcon({ name }: { name: IconName }) {
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICON_PATHS[name].map((path) => <path d={path} key={path} />)}</svg>;
}

function IconMissionTask({ code, onComplete }: { code: Exclude<TheoryCode, "files_knowledge">; onComplete: (result: TaskResult) => void }) {
  const challenges = ICON_CHALLENGES[code]; const [index, setIndex] = useState(0); const [items, setItems] = useState<ItemResult[]>([]); const started = useRef(0); const challenge = challenges[index]!;
  useEffect(() => { started.current = performance.now(); }, [index]);
  const offset = index % challenge.options.length; const options = [...challenge.options.slice(offset), ...challenge.options.slice(0, offset)];
  function answer(icon: IconName, timeStamp: number) { const success = icon === challenge.correct; const next = [...items, { success, durationMs: Math.round(timeStamp - started.current), ...(success ? {} : { failureReason: `icône choisie : ${ICON_LABELS[icon]}` }) }]; if (index === challenges.length - 1) onComplete(makeCountResult(code, next)); else { setItems(next); setIndex((value) => value + 1); } }
  return <section className="test-screen mission-screen"><TestTop title={taskInfo(code).title} counter={`${index + 1}/${challenges.length}`} /><div className="mission-progress" aria-label={`Mission ${index + 1} sur ${challenges.length}`}>{challenges.map((_, dot) => <span className={dot < index ? "done" : dot === index ? "active" : ""} key={dot} />)}</div><div className="mission-card"><p className="mission-context">Mission {index + 1} · {challenge.context}</p><h2>{challenge.prompt}</h2><p className="mission-help">Choisis uniquement l’icône correspondante.</p><div className="mission-icons">{options.map((icon) => <button aria-label={ICON_LABELS[icon]} onClick={(event) => answer(icon, event.timeStamp)} key={icon}><UiIcon name={icon} /></button>)}</div></div></section>;
}

type ExplorerTreeNode = { kind: "file" } | { kind: "folder"; children: Record<string, ExplorerTreeNode> };
const EXPLORER_TREE: ExplorerTreeNode = { kind: "folder", children: {
  Documents: { kind: "folder", children: {
    École: { kind: "folder", children: {
      Français: { kind: "folder", children: { "Fiche lecture.pdf": { kind: "file" }, "Poésie.pdf": { kind: "file" }, "Vocabulaire.docx": { kind: "file" } } },
      Mathématiques: { kind: "folder", children: { "Exercices fractions.pdf": { kind: "file" }, "Tables.pdf": { kind: "file" }, "Géométrie.docx": { kind: "file" } } },
    } },
    Devoirs: { kind: "folder", children: { Histoire: { kind: "folder", children: { "Antiquité.docx": { kind: "file" }, "Moyen Âge.pdf": { kind: "file" } } }, "Sciences.pdf": { kind: "file" } } },
    "Notes.txt": { kind: "file" },
  } },
  Téléchargements: { kind: "folder", children: { "Autorisation sortie.pdf": { kind: "file" }, "Programme.pdf": { kind: "file" }, "image.png": { kind: "file" } } },
  Images: { kind: "folder", children: { Exposé: { kind: "folder", children: { "Planète Mars.jpg": { kind: "file" }, "Terre.jpg": { kind: "file" }, "Soleil.jpg": { kind: "file" } } }, "Photo classe.jpg": { kind: "file" } } },
} };
const EXPLORER_TARGETS = [
  ["Documents", "École", "Français", "Fiche lecture.pdf"],
  ["Documents", "École", "Mathématiques", "Exercices fractions.pdf"],
  ["Téléchargements", "Autorisation sortie.pdf"],
  ["Images", "Exposé", "Planète Mars.jpg"],
  ["Documents", "Devoirs", "Histoire", "Antiquité.docx"],
] as const;

function folderAt(path: string[]): Extract<ExplorerTreeNode, { kind: "folder" }> {
  let node: ExplorerTreeNode = EXPLORER_TREE;
  for (const part of path) { if (node.kind !== "folder") break; node = node.children[part]!; }
  return node as Extract<ExplorerTreeNode, { kind: "folder" }>;
}

function ExplorerFindTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [index, setIndex] = useState(0); const [items, setItems] = useState<ItemResult[]>([]); const [path, setPath] = useState<string[]>([]); const [selected, setSelected] = useState(""); const [mistakes, setMistakes] = useState(0); const [totalMistakes, setTotalMistakes] = useState(0); const [notice, setNotice] = useState(""); const started = useRef(0); const target = EXPLORER_TARGETS[index]!; const folder = folderAt(path); const entries = Object.entries(folder.children);
  useEffect(() => { started.current = performance.now(); }, [index]);
  function markMistake(message: string) { setMistakes((value) => value + 1); setTotalMistakes((value) => value + 1); setNotice(message); }
  function openSelected(timeStamp: number) {
    if (!selected) { markMistake("Sélectionne d’abord un élément."); return; }
    const node = folder.children[selected]!; const nextPath = [...path, selected];
    if (node.kind === "folder") { const expectedFolders = target.slice(0, -1); const correctDirection = nextPath.every((part, partIndex) => expectedFolders[partIndex] === part); if (!correctDirection) markMistake("Ce dossier ne correspond pas au chemin affiché."); else setNotice(""); setPath(nextPath); setSelected(""); return; }
    if (nextPath.join("/") !== target.join("/")) { markMistake("Ce n’est pas le document demandé."); return; }
    const next = [...items, { success: mistakes === 0, durationMs: Math.round(timeStamp - started.current), ...(mistakes ? { failureReason: `${mistakes} erreur(s) de navigation` } : {}) }];
    if (index === EXPLORER_TARGETS.length - 1) onComplete({ ...makeCountResult("files_knowledge", next), metrics: { cheminsTrouves: next.length, sansErreur: next.filter((item) => item.success).length, erreursNavigation: totalMistakes, dureeSecondes: Math.round(next.reduce((sum, item) => sum + item.durationMs, 0) / 1000) } });
    else { setItems(next); setIndex((value) => value + 1); setPath([]); setSelected(""); setMistakes(0); setNotice(""); }
  }
  return <section className="test-screen explorer-mission"><TestTop title="Mission explorateur" counter={`${index + 1}/${EXPLORER_TARGETS.length}`} /><div className="explorer-goal"><p className="eyebrow">Document à retrouver</p><h2>{target.join(" › ")}</h2><p>Ouvre les dossiers, sélectionne le document puis touche « Ouvrir ».</p></div><div className="universal-explorer"><div className="universal-explorer-bar"><button aria-label="Dossier précédent" disabled={path.length === 0} onClick={() => { setPath((current) => current.slice(0, -1)); setSelected(""); setNotice(""); }}>←</button><span>Accueil{path.length ? ` › ${path.join(" › ")}` : ""}</span></div><div className="universal-file-grid">{entries.map(([name, node]) => <button className={selected === name ? "selected" : ""} onClick={() => { setSelected(name); setNotice(""); }} key={name}><UiIcon name={node.kind === "folder" ? "folder" : "file"} /><span>{name}</span></button>)}</div><div className="explorer-mission-actions"><span role="status">{notice}</span><button className="primary" disabled={!selected} onClick={(event) => openSelected(event.timeStamp)}>Ouvrir</button></div></div></section>;
}

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

function ChoiceTask({ code, items: questions, onComplete }: { code: TaskCode; items: ChoiceItem[]; onComplete: (result: TaskResult) => void }) {
  const [index, setIndex] = useState(0); const [results, setResults] = useState<ItemResult[]>([]); const started = useRef(0); const item = questions[index]!;
  const options = item.choices.map((choice, originalIndex) => ({ choice, originalIndex })); const offset = index % options.length; const displayedOptions = [...options.slice(offset), ...options.slice(0, offset)];
  useEffect(() => { started.current = performance.now(); }, [index]);
  function answer(choice: number, timeStamp: number) { const success = choice === item.correct; const next = [...results, { success, durationMs: Math.round(timeStamp - started.current), ...(success ? {} : { failureReason: "réponse incorrecte" }) }]; if (index === questions.length - 1) onComplete(makeCountResult(code, next)); else { setResults(next); setIndex((value) => value + 1); } }
  return <section className="test-screen"><TestTop title={taskInfo(code).title} counter={`${index + 1}/${questions.length}`} /><div className="question-card"><p className="eyebrow">Choisis une réponse</p><h2>{item.prompt}</h2><div className="choice-list">{displayedOptions.map((option) => <button key={option.choice} onClick={(event) => answer(option.originalIndex, event.timeStamp)}>{option.choice}</button>)}</div></div></section>;
}

function Report({ participant, assessment, onBack }: { participant: Participant; assessment: Assessment; onBack: () => void }) {
  return <section className="flow-card report"><FlowHeader step="Bilan expérimental" title={`${participant.firstName} ${participant.lastName}`} onBack={onBack} /><div className="report-meta"><span>{participant.schoolLevel}</span><span>{participant.ageYears} ans {participant.ageMonths} mois</span><span>{new Date(assessment.completedAt ?? assessment.createdAt).toLocaleDateString("fr-FR")}</span></div><div className="report-warning">Résultats descriptifs des connaissances numériques — aucune note globale, mesure pratique ni interprétation diagnostique.</div><div className="result-table">{assessment.results.map((result) => { const successes = result.items.filter((item) => item.success).length; return <article key={result.taskCode}><div><h3>{taskInfo(result.taskCode).title}</h3><p>{successes} réussite(s) sur {result.items.length}</p></div><div className="metrics">{Object.entries(result.metrics).slice(0, 4).map(([key, value]) => <span key={key}><small>{metricLabel(key)}</small><strong>{value}</strong></span>)}</div></article>; })}</div><div className="form-actions"><button className="secondary" onClick={onBack}>Retour aux dossiers</button><button className="primary" onClick={() => window.print()}>Imprimer / enregistrer en PDF</button></div></section>;
}

function FlowHeader({ step, title, onBack }: { step: string; title: string; onBack: () => void }) { return <header className="flow-header"><button className="back-button" onClick={onBack} aria-label="Retour">←</button><div><p className="eyebrow">{step}</p><h2>{title}</h2></div></header>; }
function TestTop({ title, counter }: { title: string; counter: string }) { return <header className="test-top"><span>BCN</span><strong>{title}</strong><span>{counter}</span></header>; }
function taskInfo(code: TaskCode) { return TASKS.find((task) => task.code === code) ?? { code, title: LEGACY_TASK_TITLES[code] ?? "Épreuve archivée", description: "Ancienne épreuve" }; }
function instructionFor(code: TaskCode) { if (code === "files_knowledge") return "Suivre cinq chemins dans un explorateur simulé, sélectionner le bon document puis l’ouvrir."; if (code in ICON_CHALLENGES) return "Résoudre cinq missions en choisissant l’icône adaptée à chaque situation."; if (code in THEORY_BANKS) return "Répondre à cinq situations de connaissances numériques."; const instructions: Partial<Record<TaskCode,string>> = { typing_copy: "Recopier un texte pendant cinq minutes, sans aide à la correction.", pointing_click: "Cliquer ou toucher dix cibles.", pointing_double: "Double-cliquer ou double-toucher dix cibles.", pointing_drag: "Déplacer dix objets au centre de leur cible.", visual_search: "Repérer quinze icônes réparties entre Windows, traitement de texte et actions courantes.", keyboard_shortcuts: "Réaliser les raccourcis de base dans deux fenêtres simulées.", file_management: "Réaliser sept actions dans un explorateur de fichiers simulé.", comprehension: "Répondre à six consignes numériques.", navigation: "Résoudre quatre situations simulées." }; return instructions[code] ?? "Réaliser l’épreuve."; }
function makeCountResult(taskCode: TaskCode, items: ItemResult[]): TaskResult { return { taskCode, completedAt: new Date().toISOString(), items, metrics: { reussites: items.filter((item) => item.success).length, erreurs: items.filter((item) => !item.success).length } }; }
function makePointingResult(taskCode: TaskCode, items: ItemResult[]): TaskResult { const successfulTimes = items.filter((item) => item.success).map((item) => item.durationMs).sort((a,b) => a-b); return { ...makeCountResult(taskCode, items), metrics: { reussites: successfulTimes.length, erreurs: items.length - successfulTimes.length, tempsMedianMs: successfulTimes.length ? successfulTimes[Math.floor(successfulTimes.length / 2)]! : 0 } }; }
function words(value: string) { return value.trim() ? value.trim().split(/\s+/u) : []; }
function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase(); }
function round(value: number) { return Math.round(value * 10) / 10; }
function metricLabel(value: string) { return ({ reussites: "Réussites", erreurs: "Erreurs", phases: "Phases", raccourcisReussis: "Raccourcis réussis", changementFenetre: "Changement de fenêtre", erreursActions: "Actions incorrectes", actionsAutonomes: "Actions autonomes", aides: "Aides", cheminsTrouves: "Chemins trouvés", sansErreur: "Sans erreur", erreursNavigation: "Erreurs de navigation", tempsMedianMs: "Temps médian (ms)", motsSaisis: "Mots saisis", motsCorrects: "Mots corrects", motsParMinute: "Mots/min", motsCorrectsParMinute: "Mots corrects/min", dureeSecondes: "Durée (s)" } as Record<string,string>)[value] ?? value; }
