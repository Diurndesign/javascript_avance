"use strict";
/* =====================================================================
   CLIENT « ESCALE » : une appli à plusieurs écrans
   hidden, data-* / dataset, getElementById, menu burger, form.reset()
   ===================================================================== */

DIAGRAMS.screens = () => ({
  title: "Changer d’écran dans une seule page",
  html: `<div class="dg-row dg-wrap dg-flow"><span class="dg-chip">clic sur un bouton</span>${AR("")}${DC("bouton.dataset.cible")}${AR("")}<span class="dg-chip">« reservation »</span>${AR("")}${DC("tous les écrans : hidden = true")}${AR("")}${DC("getElementById(\"reservation\").hidden = false")}</div>
    <div class="dg-grid3" style="margin-top:12px"><div class="dg-card"><b>#accueil</b><div class="dg-mem">hidden</div><small>caché</small></div><div class="dg-card dg-hl"><b>#reservation</b><div class="dg-page">visible</div><small>le seul affiché</small></div><div class="dg-card"><b>#confirmation</b><div class="dg-mem">hidden</div><small>caché</small></div></div>`,
  caption: "Tous les écrans sont dans la même page HTML. On les **cache tous**, puis on **montre** celui demandé : c’est un prototype Figma, mais en vrai code. L’attribut `data-cible` range dans le bouton le nom de l’écran à ouvrir."
});
DIAGRAM_ORDER.splice(DIAGRAM_ORDER.indexOf("form") + 1, 0, "screens");

CHAPTERS.splice(CHAPTERS.findIndex(c => c.n === 8) + 1, 0, {
  n: 12, client: "Escale", kind: "Appli de réservation · plusieurs écrans", notions: ["hidden", "data-*", "dataset", "getElementById", "menu burger", "reset()"],
  mock: `<div class="mk"><div class="mk-bar"><span>Escale · 3 écrans</span></div><div class="mk-body mk-col"><div class="mk-chips"><span>Accueil</span><span class="on">Réservation</span><span>Confirmation</span></div><p class="mk-h">Réserve ta table</p><div class="mk-field">Léa</div><span class="mk-btn">Confirmer</span></div></div>`
});

const STAGE_ESCALE = `<div class="appli">
  <section class="ecran" id="accueil">
    <h2>Escale</h2>
    <p>Réserve ta table en 30 secondes.</p>
    <button data-cible="reservation">Réserver</button>
  </section>
  <section class="ecran" id="reservation" hidden>
    <h2>Réservation</h2>
    <form id="form-resa">
      <label for="nom">Ton nom</label>
      <input id="nom" type="text">
      <label for="couverts">Nombre de personnes</label>
      <input id="couverts" type="number" value="2">
      <button type="submit">Confirmer</button>
      <p class="erreur"></p>
    </form>
    <button class="secondaire" data-cible="accueil">← Retour</button>
  </section>
  <section class="ecran" id="confirmation" hidden>
    <h2>C’est réservé !</h2>
    <p class="recap"></p>
    <button data-cible="accueil">Retour à l’accueil</button>
  </section>
</div>`;
const visible = (st, id) => { const e = st.querySelector("#" + id); return !!e && !e.hidden; };
const onlyVisible = (st, id) => ["accueil", "reservation", "confirmation"].every(x => visible(st, x) === (x === id));
const whichVisible = st => ["accueil", "reservation", "confirmation"].filter(x => visible(st, x)).join(", ") || "aucun";

insertAfter("gazette-mission", [
{
  id: "escale-observer", ch: 12, type: "observe", title: "Changer d’écran", notion: "hidden et data-*",
  bip: "Escale veut une appli de réservation avec plusieurs écrans. Pas besoin de plusieurs pages HTML : tous les écrans sont dans la même page, et JavaScript n’en montre qu’un. Le jeu va cliquer sur « Réserver » pour toi.",
  stage: `<section class="ecran" id="accueil">
  <h2>Escale</h2>
  <button data-cible="reservation">Réserver</button>
</section>
<section class="ecran" id="reservation" hidden>
  <h2>Réservation</h2>
  <button data-cible="accueil">← Retour</button>
</section>`,
  simulate: stage => { stage.querySelector('[data-cible="reservation"]').click(); },
  simulateLabel: "Le visiteur clique sur « Réserver ». La fonction du bouton se réveille.",
  diagrams: ["screens"],
  where: { text: "Les applis à onglets, les tunnels de commande (panier → livraison → paiement), les écrans d’accueil en plusieurs étapes : souvent une seule page, où JavaScript cache et montre des blocs.", tags: [["Réserver", "data-cible=\"reservation\""], ["écran caché", "ecran.hidden = true"]] },
  why: "C’est exactement un prototype Figma, mais en vrai : chaque écran est une section, et un clic décide laquelle est visible. Pas besoin de recharger la page.",
  lesson: {
    what: "`hidden` est un attribut HTML : un élément `hidden` n’est pas affiché. En JavaScript, `element.hidden = true` le cache, `false` le montre. Un attribut `data-quelquechose` est une étiquette **inventée** pour ranger une info dans le HTML : JavaScript la lit avec `element.dataset.quelquechose`.",
    code: `<button data-cible="reservation">Réserver</button>\n\nbouton.dataset.cible   // "reservation"\nmenu.hidden = true;     // caché\nmenu.hidden = false;    // visible`,
    pieces: [["data-cible=\"…\"", "un attribut « maison » : on choisit le nom après data-"], ["bouton.dataset.cible", "le lire en JavaScript (sans le data-)"], ["document.getElementById(\"x\")", "trouve l’élément qui a l’id x (sans #)"], [".hidden = true / false", "cacher / montrer"]],
    trap: "Avec `getElementById`, on écrit l’id **sans** le `#` : `getElementById(\"accueil\")`. Avec `querySelector`, on le met : `querySelector(\"#accueil\")`."
  },
  code: `const boutons = document.querySelectorAll("[data-cible]");
const ecrans = document.querySelectorAll(".ecran");

boutons.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const cible = bouton.dataset.cible;
    ecrans.forEach((ecran) => {
      ecran.hidden = true;
    });
    document.getElementById(cible).hidden = false;
  });
});`,
  notes: {
    1: "`querySelectorAll` attrape **tous** les éléments qui ont un attribut `data-cible` : ici les 2 boutons. `[data-cible]` est un sélecteur CSS d’attribut.",
    2: "Tous les écrans : les deux sections qui ont la classe `ecran`.",
    4: "On branche un écouteur sur **chaque** bouton, avec une boucle.",
    6: "On est dans le clic. On lit l’étiquette du bouton cliqué : `\"reservation\"`.",
    8: "Première étape : on cache **tous** les écrans, sans exception.",
    10: "Deuxième étape : on montre seulement l’écran dont l’id est la cible. Regarde l’aperçu de la page."
  },
  questions: [
    { q: "Que contient `cible` à la ligne 6, quand on clique sur « Réserver » ?", opts: ["Le bouton", "Le texte \"reservation\", lu dans data-cible", "Le texte \"Réserver\""], a: 1, why: "`dataset.cible` lit la valeur de l’attribut `data-cible`, pas le texte du bouton." },
    { q: "Pourquoi cacher **tous** les écrans avant d’en montrer un ?", opts: ["Pour être sûr qu’un seul écran reste visible, quel que soit celui affiché avant", "Parce que hidden ne marche qu’une fois", "Ce n’est pas utile"], a: 0, why: "On ne sait pas quel écran était ouvert : on remet tout à zéro, puis on montre le bon." },
    { q: "Pour ajouter un 3e écran « profil », que faut-il changer dans le JavaScript ?", opts: ["Rien : une section .ecran avec id=\"profil\" et un bouton data-cible=\"profil\" suffisent", "Ajouter un nouvel addEventListener", "Réécrire la boucle"], a: 0, why: "Le code est générique : c’est le HTML qui dit quel bouton ouvre quel écran." }
  ],
  debrief: "Une page, plusieurs écrans, un seul visible : c’est la base de toute appli. Et grâce à `data-cible`, le même code marche pour 2 écrans comme pour 20."
},
{
  id: "escale-predire", ch: 12, type: "predict", title: "Ce que dit l’étiquette", notion: "dataset et getElementById",
  bip: "Devine ce que la console affiche. Attention à l’id écrit avec une majuscule à la fin.",
  stage: `<button data-cible="profil">Mon profil</button>
<section id="profil" hidden><h2>Profil</h2></section>`,
  where: { text: "Quand un bouton n’ouvre pas le bon écran, on vérifie deux choses dans la console : ce que contient `dataset`, et si `getElementById` trouve bien l’élément.", tags: [["Mon profil", "bouton.dataset.cible"]] },
  why: "Savoir ce que renvoient `dataset`, `hidden` et `getElementById`, c’est savoir déboguer une navigation qui ne marche pas.",
  code: `const bouton = document.querySelector("button");
console.log(bouton.dataset.cible);
console.log(typeof bouton.dataset.cible);
const ecran = document.getElementById("profil");
console.log(ecran.hidden);
ecran.hidden = false;
console.log(ecran.hidden);
console.log(document.getElementById("Profil"));`,
  explain: [
    "`dataset.cible` lit l’attribut `data-cible` : profil.",
    "Un attribut HTML est **toujours** du texte : string.",
    "La section a l’attribut `hidden` dans le HTML : elle est cachée, donc `true`.",
    "On vient de la montrer : `hidden` vaut maintenant `false`.",
    "« Profil » avec une majuscule n’est pas « profil » : aucun élément trouvé, `getElementById` renvoie `null`."
  ],
  debrief: "Trois réflexes : `dataset` donne du texte, `hidden` est un booléen, et un id mal écrit (majuscule comprise) donne `null`."
},
{
  id: "escale-burger", ch: 12, type: "fill", title: "Le menu burger", notion: "classList.toggle",
  bip: "Escale veut un menu qui s’ouvre et se ferme, comme sur toutes les applis mobiles. Complète le code, puis clique sur « Menu » dans l’onglet Page.",
  stage: `<header class="barre-appli">
  <b>Escale</b>
  <button class="burger" aria-expanded="false">Menu</button>
</header>
<nav class="menu">
  <a href="#">Réserver</a>
  <a href="#">Mes réservations</a>
  <a href="#">Contact</a>
</nav>`,
  diagrams: ["event"],
  where: { text: "Le bouton à trois traits en haut des sites sur mobile : un clic ajoute une classe qui affiche le menu, un autre clic l’enlève.", tags: [["Menu", "burger.addEventListener(\"click\", …)"], ["menu ouvert", "menu.classList.toggle(\"ouvert\")"]] },
  why: "Sur mobile, il n’y a pas la place d’afficher tout le menu. Le burger le cache, et JavaScript l’ouvre à la demande. C’est le composant interactif le plus courant du web.",
  lesson: {
    what: "Le menu est caché par le CSS, sauf quand il a la classe `ouvert`. JavaScript bascule cette classe à chaque clic avec `classList.toggle`. L’attribut `aria-expanded` dit aux lecteurs d’écran si le menu est ouvert.",
    code: `burger.addEventListener("click", () => {\n  menu.classList.toggle("ouvert");\n});`,
    pieces: [[".toggle(\"ouvert\")", "ajoute la classe si elle manque, l’enlève si elle est là"], [".contains(\"ouvert\")", "true si le menu est ouvert"], ["aria-expanded", "accessibilité : « ouvert » ou non pour les lecteurs d’écran"]],
    trap: "Le texte du bouton se met à jour **après** le toggle, pour refléter le nouvel état."
  },
  steps: ["Complète les cases vides.", "Lance, puis clique sur « Menu » dans l’onglet **Page**, deux fois.", "Réponds aux questions pour valider."],
  template: `const burger = document.querySelector({{".burger"}});
const menu = document.querySelector(".menu");

burger.addEventListener("click", () => {
  menu.classList.{{toggle}}("ouvert");

  if (menu.classList.contains({{"ouvert"}})) {
    burger.textContent = "Fermer";
    burger.setAttribute("aria-expanded", "true");
  } else {
    burger.textContent = {{"Menu"}};
    burger.setAttribute("aria-expanded", "false");
  }
});`,
  goals: [
    { label: "Au chargement, le menu est fermé", test: c => { const r = freshRun(c); return !r.stage.querySelector(".menu").classList.contains("ouvert"); } },
    { label: "Après 1 clic : menu ouvert, le bouton dit `Fermer`", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".burger"); if (!b) return false; b.click(); if (!r.stage.querySelector(".menu").classList.contains("ouvert")) return false; return norm(b.textContent) === "Fermer"; } },
    { label: "Après 2 clics : menu fermé, le bouton dit `Menu`", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".burger"); if (!b) return false; b.click(); b.click(); if (r.stage.querySelector(".menu").classList.contains("ouvert")) return "Au 2e clic, le menu doit se refermer : `toggle` fait les deux."; return norm(b.textContent) === "Menu"; } }
  ],
  hints: ["Case 1 : le sélecteur du bouton (une classe : avec un point).", "Case 2 : la méthode qui ajoute OU enlève une classe. Case 3 : le nom de la classe, entre guillemets.", "Case 4 : le texte du bouton quand le menu est fermé, entre guillemets."],
  check: [
    { q: "Pourquoi le menu est-il caché au départ ?", opts: ["Le CSS le cache tant qu’il n’a pas la classe `ouvert`", "JavaScript le cache au chargement", "Il n’existe pas encore"], a: 0, why: "Le JS dit seulement « ouvert ou pas » ; c’est le CSS qui affiche ou cache." },
    { q: "À quoi sert `aria-expanded` ?", opts: ["À animer le menu", "À dire aux lecteurs d’écran (personnes malvoyantes) si le menu est ouvert", "À rien"], a: 1, why: "C’est de l’accessibilité : l’état visuel est aussi annoncé à ceux qui ne voient pas l’écran." }
  ],
  debrief: "Sélectionner, écouter, basculer une classe : le trio du menu burger. Le même code ouvre une modale, un panneau de filtres ou une FAQ en accordéon."
},
{
  id: "escale-reparer", ch: 12, type: "fix", title: "Le message invisible", notion: "hidden et reset()",
  bip: "Bug chez Escale : quand on confirme une réservation, le message de remerciement n’apparaît pas, et le nom reste tapé dans le champ. Deux bugs, à toi.",
  stage: `<form id="form-resa">
  <label for="nom">Ton nom</label>
  <input id="nom" type="text">
  <button type="submit">Confirmer</button>
</form>
<p class="merci" hidden></p>`,
  where: { text: "Après l’envoi d’un formulaire, une bonne appli affiche une confirmation et vide les champs : le visiteur sait que c’est fait, et peut recommencer.", tags: [["Merci Léa !", "merci.hidden = false"], ["champ vidé", "formulaire.reset()"]] },
  why: "Un formulaire qui ne répond rien, c’est un visiteur qui clique trois fois et réserve trois tables. Le retour visuel, c’est de l’UX.",
  lesson: {
    what: "`formulaire.reset()` remet tous les champs d’un formulaire à leur valeur de départ, en une ligne. Un élément `hidden` reste caché tant qu’on ne met pas `hidden = false`, même si on change son texte.",
    code: `merci.textContent = "Merci !";\nmerci.hidden = false;   // on le montre\nformulaire.reset();     // on vide les champs`,
    pieces: [["formulaire.reset()", "vide tous les champs (méthode du formulaire, pas d’un champ)"], ["hidden = false", "rend visible"]],
    trap: "Changer le texte d’un élément caché ne le montre pas : il faut aussi changer `hidden`."
  },
  steps: ["Lance, puis teste dans l’onglet **Page** : tape un nom et clique sur Confirmer.", "Le message doit apparaître, et le champ doit se vider.", "Corrige les deux bugs."],
  starter: `const formulaire = document.getElementById("form-resa");
const champNom = document.getElementById("nom");
const merci = document.querySelector(".merci");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  merci.textContent = "Merci " + champNom.value + " !";
  merci.hidden = true;
});
`,
  goals: [
    { label: "Après l’envoi avec « Léa » : `Merci Léa !` est visible", test: c => { const r = freshRun(c); r.stage.querySelector("#nom").value = "Léa"; submitForm(r.stage, "#form-resa"); const m = r.stage.querySelector(".merci"); if (txt(r.stage, ".merci") !== "Merci Léa !") return false; return !m.hidden || "Le texte est bon, mais le message est encore caché : regarde la valeur donnée à `hidden`."; } },
    { label: "Après l’envoi, le champ du nom est vidé", test: c => { const r = freshRun(c); r.stage.querySelector("#nom").value = "Léa"; submitForm(r.stage, "#form-resa"); return r.stage.querySelector("#nom").value === "" || "Le nom est toujours tapé : il manque `formulaire.reset()`."; } },
    { label: "Le message utilise le nom tapé (test caché avec « Axel »)", test: c => { const r = freshRun(c); r.stage.querySelector("#nom").value = "Axel"; submitForm(r.stage, "#form-resa"); return txt(r.stage, ".merci") === "Merci Axel !"; } }
  ],
  hints: ["Bug 1 : `hidden = true` cache l’élément. Pour le montrer, quelle valeur faut-il ?", "Bug 2 : il faut vider le formulaire à la fin, avec une méthode du **formulaire**.", "Attention à l’ordre : lis `champNom.value` **avant** le `reset()`, sinon le nom est déjà effacé."],
  solution: `const formulaire = document.getElementById("form-resa");
const champNom = document.getElementById("nom");
const merci = document.querySelector(".merci");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  merci.textContent = "Merci " + champNom.value + " !";
  merci.hidden = false;
  formulaire.reset();
});`,
  check: [
    { q: "Pourquoi `formulaire.reset()` doit-il venir **après** la ligne qui écrit le message ?", opts: ["Sinon le champ est déjà vidé quand on lit le nom, et le message dit « Merci  ! »", "reset() doit toujours être en dernier dans un fichier", "L’ordre ne compte pas"], a: 0, why: "Le code s’exécute de haut en bas : on lit d’abord, on vide ensuite." },
    { q: "Pourquoi utiliser `getElementById(\"nom\")` plutôt que `querySelector(\"#nom\")` ?", opts: ["Les deux marchent : getElementById cherche seulement par id, sans le #", "querySelector ne trouve pas les id", "getElementById est obligatoire dans un formulaire"], a: 0, why: "C’est une question d’habitude : `querySelector` accepte tous les sélecteurs CSS, `getElementById` seulement un id." }
  ],
  debrief: "Montrer un message, vider le formulaire : deux lignes qui changent tout pour le visiteur. C’est le « feedback » dont on parle en UX."
},
{
  id: "escale-mission", ch: 12, type: "real", title: "Le parcours de réservation", notion: "flow complet",
  bip: "Commande finale d’Escale : l’appli complète, avec ses 3 écrans. Accueil, réservation, confirmation. Le jeu va tester tout le parcours.",
  stage: STAGE_ESCALE,
  diagrams: ["screens", "form"],
  where: { text: "Le tunnel de réservation d’un restaurant, d’un coiffeur ou d’un billet de train : des écrans qui s’enchaînent, un formulaire vérifié, un écran de confirmation.", tags: [["Réserver", "data-cible + afficherEcran()"], ["Confirmer", "submit + reset()"], ["C’est réservé !", "afficherEcran(\"confirmation\")"]] },
  why: "C’est ce que ta maquette Figma montre : un flow. Ici, il devient une vraie appli qu’on peut cliquer, avec des données tapées par le visiteur.",
  steps: [
    "Écris une fonction `afficherEcran(id)` : elle cache tous les `.ecran`, puis montre celui dont l’id est `id` (avec `getElementById`).",
    "Pour chaque bouton qui a un attribut `data-cible` : au clic, appelle `afficherEcran(bouton.dataset.cible)`.",
    "À l’envoi de `#form-resa` : empêche le rechargement. Si le nom est vide, `.erreur` affiche `Ton nom est obligatoire`.",
    "Sinon : vide `.erreur`, écris dans `.recap` `Merci Léa, table pour 2 personnes réservée !` (avec le nom et le nombre tapés), vide le formulaire avec `reset()`, puis affiche l’écran `confirmation`."
  ],
  starter: `const ecrans = document.querySelectorAll(".ecran");
const boutons = document.querySelectorAll("[data-cible]");
const formulaire = document.getElementById("form-resa");
const champNom = document.getElementById("nom");
const champCouverts = document.getElementById("couverts");
const erreur = document.querySelector(".erreur");
const recap = document.querySelector(".recap");

`,
  goals: [
    { label: "`afficherEcran(\"confirmation\")` ne montre que l’écran confirmation", test: c => { const r = freshRun(c); const f = V(r, "afficherEcran"); if (typeof f !== "function") return "Crée d’abord la fonction `afficherEcran(id)`."; try { f("confirmation"); } catch (e) { return /getElementById\(\s*["'`]#|getElementById\(\s*"#"\s*\+/.test(c.code) ? "Avec `getElementById`, on écrit l’id **sans** le # : `document.getElementById(id)`." : "`afficherEcran` plante : " + e.message; } return onlyVisible(r.stage, "confirmation") || "Écrans visibles : " + whichVisible(r.stage) + ". Il faut cacher tous les écrans, puis montrer seulement le bon."; } },
    { label: "Clic sur « Réserver » : seul l’écran réservation est visible", test: c => { const r = freshRun(c); const b = r.stage.querySelector('#accueil [data-cible]'); if (!b) return false; b.click(); return onlyVisible(r.stage, "reservation") || "Après le clic, écrans visibles : " + whichVisible(r.stage) + "."; } },
    { label: "Clic sur « ← Retour » : on revient à l’accueil", test: c => { const r = freshRun(c); r.stage.querySelector('#accueil [data-cible]').click(); r.stage.querySelector('#reservation [data-cible="accueil"]').click(); return onlyVisible(r.stage, "accueil") || "Écrans visibles : " + whichVisible(r.stage) + "."; } },
    { label: "Nom vide : `Ton nom est obligatoire`, et on reste sur la réservation", test: c => { const r = freshRun(c); r.stage.querySelector('#accueil [data-cible]').click(); const avant = whichVisible(r.stage); submitForm(r.stage, "#form-resa"); if (txt(r.stage, ".erreur") !== "Ton nom est obligatoire") return false; return whichVisible(r.stage) === avant || "L’erreur s’affiche, mais l’écran a changé : on doit rester sur la réservation."; } },
    { label: "« Léa », 2 personnes : écran confirmation et `Merci Léa, table pour 2 personnes réservée !`", test: c => { const r = freshRun(c); const st = r.stage; st.querySelector('#accueil [data-cible]').click(); st.querySelector("#nom").value = "Léa"; submitForm(st, "#form-resa"); if (txt(st, ".recap") !== "Merci Léa, table pour 2 personnes réservée !") { if (txt(st, ".erreur") === "Ton nom est obligatoire") return "Le nom était bien tapé, mais ton code a lu un champ vide : lis `champNom.value` **avant** `formulaire.reset()`."; return txt(st, ".recap") ? "Le récap affiche « " + txt(st, ".recap") + " »." : false; } return onlyVisible(st, "confirmation") || "Le récap est bon, mais l’écran confirmation n’est pas le seul visible (" + whichVisible(st) + ")."; } },
    { label: "Après la réservation, le formulaire est vidé et l’erreur effacée", test: c => { const r = freshRun(c); const st = r.stage; st.querySelector('#accueil [data-cible]').click(); submitForm(st, "#form-resa"); st.querySelector("#nom").value = "Léa"; submitForm(st, "#form-resa"); if (st.querySelector("#nom").value !== "") return "Le nom est resté dans le champ : il manque `formulaire.reset()`."; if (!txt(st, ".recap")) return "La réservation n’a pas abouti : regarde l’objectif précédent."; return txt(st, ".erreur") === "" || "L’ancienne erreur est restée affichée : vide `.erreur` quand tout est bon."; } },
    { label: "Ça marche avec d’autres données (test caché : Axel, 4 personnes)", test: c => { const r = freshRun(c); const st = r.stage; st.querySelector('#accueil [data-cible]').click(); st.querySelector("#nom").value = "Axel"; st.querySelector("#couverts").value = "4"; submitForm(st, "#form-resa"); return txt(st, ".recap") === "Merci Axel, table pour 4 personnes réservée !"; } },
    { label: "Tu lis la cible avec `dataset`, et la page ne se recharge pas", test: c => { if (!/\.dataset\.cible/.test(c.code)) return "Lis l’écran à ouvrir avec `bouton.dataset.cible`."; const r = freshRun(c); return submitForm(r.stage, "#form-resa").defaultPrevented || "Ajoute `event.preventDefault()` au début du submit."; } }
  ],
  hints: [
    "La fonction : `function afficherEcran(id) { ecrans.forEach((ecran) => { ecran.hidden = true; }); document.getElementById(id).hidden = false; }`",
    "Les boutons : `boutons.forEach((bouton) => { bouton.addEventListener(\"click\", () => { afficherEcran(bouton.dataset.cible); }); });`",
    "Le récap : `\"Merci \" + nom + \", table pour \" + couverts + \" personnes réservée !\"`. Lis les deux champs **avant** le `reset()`."
  ],
  solution: `const ecrans = document.querySelectorAll(".ecran");
const boutons = document.querySelectorAll("[data-cible]");
const formulaire = document.getElementById("form-resa");
const champNom = document.getElementById("nom");
const champCouverts = document.getElementById("couverts");
const erreur = document.querySelector(".erreur");
const recap = document.querySelector(".recap");

function afficherEcran(id) {
  ecrans.forEach((ecran) => {
    ecran.hidden = true;
  });
  document.getElementById(id).hidden = false;
}

boutons.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    afficherEcran(bouton.dataset.cible);
  });
});

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const nom = champNom.value;
  const couverts = champCouverts.value;

  if (nom === "") {
    erreur.textContent = "Ton nom est obligatoire";
  } else {
    erreur.textContent = "";
    recap.textContent = "Merci " + nom + ", table pour " + couverts + " personnes réservée !";
    formulaire.reset();
    afficherEcran("confirmation");
  }
});`,
  check: [
    { q: "Pourquoi écrire une fonction `afficherEcran` au lieu de cacher/montrer les écrans directement dans chaque clic ?", opts: ["On l’utilise à deux endroits (les boutons et le formulaire) : le code est écrit une seule fois", "Les fonctions vont plus vite", "C’est obligatoire avec hidden"], a: 0, why: "Une action répétée = une fonction. Si demain on ajoute une animation, on la change à un seul endroit." },
    { q: "Pourquoi lire `champNom.value` avant `formulaire.reset()` ?", opts: ["reset() vide les champs : après, le nom n’y est plus", "reset() supprime le formulaire", "L’ordre ne compte pas"], a: 0, why: "On lit d’abord, on vide ensuite : le code s’exécute de haut en bas." }
  ],
  debrief: "Trois écrans, une navigation, un formulaire vérifié, un écran de confirmation : tu as codé un vrai flow d’appli. C’est exactement ce qu’on attend d’un prototype interactif."
}
]);
