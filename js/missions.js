"use strict";
/* =====================================================================
   BIP AGENCE · les clients (chapitres) et les 36 missions
   Types : observe (pas à pas + questions), predict (deviner la console),
   fill (trous), fix (réparer), write (coder), real (mission client)
   ===================================================================== */

const CHAPTERS = [
  { n: 1, client: "Pain d’Or", kind: "Boulangerie · site vitrine", notions: ["variables", "types", "console.log", "+"],
    mock: `<div class="mk"><div class="mk-bar"><span>paindor.fr</span></div><div class="mk-body mk-row"><div class="mk-img mk-img-bread"></div><div class="mk-col"><p class="mk-h">Croissant</p><p class="mk-price">1,20 €</p><span class="mk-badge mk-ok">En stock</span><p class="mk-small">Ouvert de 7h à 19h</p></div></div></div>` },
  { n: 2, client: "Bobine", kind: "Boutique de vêtements · panier", notions: ["opérateurs", "let / const", "comparaisons"],
    mock: `<div class="mk"><div class="mk-bar"><span>bobine.shop/panier</span></div><div class="mk-body mk-col"><div class="mk-line"><span>T-shirt Bobine × 1</span><b>25 €</b></div><div class="mk-line"><span>Casquette × 2</span><b>30 €</b></div><div class="mk-progress"><span style="width:100%"></span></div><p class="mk-small">Livraison offerte dès 50 € : c’est bon !</p><div class="mk-line mk-total"><span>Total</span><b>55 €</b></div><span class="mk-btn">Commander</span></div></div>` },
  { n: 3, client: "Ciel", kind: "Appli météo", notions: ["if / else", "else if", "&& ||"],
    mock: `<div class="mk mk-weather"><div class="mk-body mk-col"><p class="mk-small">Nice · lundi</p><p class="mk-temp">8°</p><p class="mk-h">Pluie</p><p>Prends un manteau et un parapluie</p><span class="mk-badge mk-ko">Alerte vent</span></div></div>` },
  { n: 4, client: "Onde", kind: "Appli de musique", notions: ["tableaux", "length", "push", "forEach"],
    mock: `<div class="mk mk-dark"><div class="mk-body mk-col"><p class="mk-h">Ma playlist</p><p class="mk-small">4 titres · 12 min</p><ol class="mk-list"><li>Intro</li><li class="on">Soleil</li><li>Nuit</li><li>Bonus</li></ol><div class="mk-player"><span>▶</span><div class="mk-progress"><span style="width:40%"></span></div></div></div></div>` },
  { n: 5, client: "Lumen", kind: "Portfolio de photographe", notions: ["objets", "tableaux d’objets", "filter"],
    mock: `<div class="mk"><div class="mk-bar"><span>lumen-photo.fr</span></div><div class="mk-body mk-col"><div class="mk-chips"><span class="on">Tout</span><span>Ville</span><span>Nature</span></div><div class="mk-grid"><div class="mk-tile t1"><b>Port de Nice</b><small>♥ 120</small></div><div class="mk-tile t2"><b>Mont Agel</b><small>♥ 85</small></div><div class="mk-tile t3"><b>Cours Saleya</b><small>♥ 40</small></div></div></div></div>` },
  { n: 6, client: "Chez Lou", kind: "Restaurant · addition en ligne", notions: ["function", "return", "=>"],
    mock: `<div class="mk mk-ticket"><div class="mk-body mk-col"><p class="mk-h">Chez Lou</p><p class="mk-small">Table 4 · 4 couverts</p><div class="mk-line"><span>Plats</span><b>80,00 €</b></div><div class="mk-line"><span>Pourboire 10 %</span><b>8,00 €</b></div><div class="mk-line mk-total"><span>Chacun paie</span><b>22,00 €</b></div></div></div>` },
  { n: 7, client: "Pixa", kind: "Réseau social", notions: ["querySelector", "textContent", "classList", "click"],
    mock: `<div class="mk"><div class="mk-body mk-col mk-center"><div class="mk-avatar">L</div><p class="mk-h">@lea.photo <span class="mk-check">✓</span></p><p class="mk-small">Photographe à Nice</p><span class="mk-like">♥ 129</span></div></div>` },
  { n: 8, client: "La Gazette", kind: "Journal · inscription newsletter", notions: ["formulaires", "submit", "value", "input"],
    mock: `<div class="mk"><div class="mk-bar"><span>lagazette.fr</span></div><div class="mk-body mk-col"><p class="mk-h">Reçois La Gazette chaque matin</p><div class="mk-field">lea@mail</div><span class="mk-btn">S’inscrire</span><p class="mk-error">Adresse e-mail invalide</p></div></div>` },
  { n: 9, client: "Panier Malin", kind: "Appli de liste de courses", notions: ["createElement", "appendChild", "afficher()"],
    mock: `<div class="mk"><div class="mk-body mk-col"><p class="mk-h">Mes courses</p><div class="mk-row"><div class="mk-field" style="flex:1">tomates</div><span class="mk-btn">Ajouter</span></div><ul class="mk-list mk-check-list"><li class="done">Pain</li><li>Lait</li><li>Pommes</li></ul><p class="mk-small">3 articles</p></div></div>` }
];

/* ---------- données réutilisées ---------- */
const PHOTOS_A = `const photos = [
  { titre: "Port de Nice", categorie: "ville", likes: 120 },
  { titre: "Mont Agel", categorie: "nature", likes: 85 },
  { titre: "Cours Saleya", categorie: "ville", likes: 40 },
  { titre: "Vallée des Merveilles", categorie: "nature", likes: 310 },
  { titre: "Cap Ferrat", categorie: "nature", likes: 100 },
  { titre: "Place Masséna", categorie: "ville", likes: 230 }
];`;
const PHOTOS_B = `const photos = [
  { titre: "Gorges du Verdon", categorie: "nature", likes: 500 },
  { titre: "Vieux Nice", categorie: "ville", likes: 99 },
  { titre: "Lac d'Allos", categorie: "nature", likes: 60 },
  { titre: "Promenade", categorie: "ville", likes: 100 }
];`;
const STAGE_PROFIL = `<div class="profil">
  <div class="avatar">L</div>
  <h2 class="pseudo">@utilisateur</h2>
  <p class="bio">Pas encore de bio.</p>
  <span class="badge-verifie">✓ Compte vérifié</span>
</div>`;
const STAGE_NEWS = `<form class="newsletter">
  <label for="email">Ton e-mail</label>
  <input id="email" type="text" placeholder="toi@exemple.fr">
  <button type="submit">S’inscrire</button>
  <p class="message"></p>
</form>`;

const LEVELS = [
/* =========================== CLIENT 1 · PAIN D’OR =========================== */
{
  id: "pain-observer", ch: 1, type: "observe", title: "La fiche produit", notion: "variables et types",
  bip: "Bienvenue à l’agence ! Notre premier client est une boulangerie. Avant d’écrire du code, on va regarder du code s’exécuter, ligne par ligne.",
  where: { text: "Sur la fiche d’un produit, chaque information affichée vient d’une variable. Le site lit ces boîtes pour remplir la page.", tags: [["Croissant", "let produit = \"Croissant\""], ["1,20 €", "let prix = 1.2"], ["En stock", "let enStock = true"]] },
  why: "Imagine que le prix du croissant apparaisse sur 12 pages du site. Sans variable, il faut le modifier 12 fois, et on en oublie toujours une. Avec une variable, on le change **à un seul endroit** et tout le site suit.",
  lesson: {
    what: "Une **variable** est une boîte avec un nom. On range une valeur dedans pour la réutiliser plus tard. Chaque valeur a un **type** : du texte (string), un nombre (number) ou vrai/faux (boolean).",
    code: `let prix = 1.2;\nprix = 1.3;      // on remplace la valeur`,
    pieces: [["let", "« je crée une boîte »"], ["prix", "le nom de la boîte"], ["=", "« reçoit » : range la valeur de droite dans la boîte de gauche"], ["prix = 1.3", "on remplace le contenu, sans remettre `let`"]],
    trap: "`\"1.2\"` avec des guillemets, c’est du texte, pas un nombre : on ne peut pas calculer correctement avec."
  },
  code: `let produit = "Croissant";
let prix = 1.2;
let enStock = true;
console.log(produit);
console.log(prix);
prix = 1.3;
console.log(produit + " : " + prix + " €");`,
  notes: {
    1: "`let` crée une boîte appelée `produit` et range dedans le texte \"Croissant\". Clique sur Suivant : la boîte va apparaître dans la Mémoire.",
    2: "Un nombre s’écrit **sans guillemets**. En JavaScript, la virgule des décimales est un **point** : `1.2`.",
    3: "`true` veut dire « vrai ». Un booléen ne vaut que `true` ou `false`. Il répond à une question : le produit est-il en stock ?",
    4: "`console.log` va chercher ce qu’il y a dans la boîte `produit` et l’affiche. Pas de guillemets autour de `produit` : on veut la **valeur**, pas le mot.",
    5: "Même chose avec `prix`. Regarde la console après cette étape.",
    6: "Le prix change ! Pas de `let` : la boîte existe déjà, on remplace juste son contenu. Surveille la Mémoire : 1.2 va devenir 1.3.",
    7: "Le `+` colle les morceaux : la valeur de `produit`, puis \" : \", puis la valeur de `prix`, puis \" €\"."
  },
  questions: [
    { q: "Juste après la ligne 6, que contient `prix` ?", opts: ["`1.2`", "`1.3`", "`\"1.3\"` (du texte)"], a: 1, why: "La ligne 6 remplace l’ancienne valeur. Pas de guillemets : c’est toujours un nombre." },
    { q: "Pourquoi `enStock` est un booléen et pas un texte comme \"oui\" ?", opts: ["C’est plus court à écrire", "Il n’y a que deux réponses possibles : vrai ou faux", "Un texte ne peut pas aller dans une variable"], a: 1, why: "Un booléen répond à une question oui/non. Le site pourra ensuite dire : si `enStock` est vrai, j’affiche « En stock »." },
    { q: "Combien de lignes s’affichent dans la console ?", opts: ["2", "3", "7"], a: 1, why: "Seules les lignes avec `console.log` affichent quelque chose : 4, 5 et 7. Les autres travaillent en silence, dans la mémoire." }
  ],
  debrief: "Tu viens de voir le cycle de base de tout programme : **créer** une valeur, la **lire**, la **modifier**. Et JavaScript exécute les lignes une par une, de haut en bas."
},
{
  id: "pain-predire", ch: 1, type: "predict", title: "Devine la console", notion: "variable ou texte ?",
  bip: "Un bon développeur sait ce que son code va faire **avant** de le lancer. Lis ce code et devine ce qui va s’afficher.",
  where: { text: "Ce piège arrive tous les jours sur les vrais sites : ce qu’on tape dans un champ de formulaire arrive toujours en texte. Un panier qui affiche « 32 articles » au lieu de 5, c’est exactement le bug de la dernière ligne.", tags: [["Quantité : 3", "\"3\" : du texte, venu d’un champ"]] },
  why: "Prédire, c’est vérifier que tu as compris. Si ta prédiction est fausse, le pas à pas te montrera où ton idée diffère de ce que fait vraiment JavaScript.",
  code: `let pain = "Baguette";
let quantite = 3;
console.log(pain);
console.log("pain");
console.log(quantite + 2);
console.log("3" + 2);`,
  explain: [
    "`pain` sans guillemets : JavaScript ouvre la boîte, qui contient Baguette.",
    "Avec des guillemets, c’est juste le mot « pain » : JavaScript ne regarde pas la boîte.",
    "`quantite` vaut 3, et 3 + 2 = 5 : deux nombres, donc une addition.",
    "`\"3\"` est du texte : le `+` colle au lieu d’additionner. Résultat : 32."
  ],
  debrief: "Les deux pièges de ce niveau (des guillemets autour d’un nom, un `+` avec du texte) sont les erreurs les plus fréquentes chez les débutants. Maintenant, tu sais les repérer."
},
{
  id: "pain-reparer", ch: 1, type: "fix", title: "Le site affiche n’importe quoi", notion: "règles d’écriture",
  bip: "La boulangère nous appelle : la page « Infos pratiques » est cassée. Le stagiaire précédent a laissé trois bugs. À toi de jouer.",
  where: { text: "La page « Infos pratiques » d’un commerce : nom, horaires, jours d’ouverture. Avec un mauvais type, le site peut afficher « Ouvert » un dimanche.", tags: [["Pain d’Or", "let nomBoutique"], ["7h - 19h", "let horaires (texte)"], ["Fermé le dimanche", "let ouvertLeDimanche = false"]] },
  why: "Réparer du code, c’est une grande partie du métier. Le message d’erreur dit **quoi** et souvent **où** : on le lit avant de toucher au code.",
  lesson: {
    what: "Trois règles : le texte va entre guillemets, un nom s’écrit exactement pareil partout (majuscules comprises), un booléen s’écrit sans guillemets.",
    code: `let jour = "lundi";       // texte : guillemets\nlet ouvert = false;       // booléen : pas de guillemets\nconsole.log(jour);        // même nom, mêmes majuscules`,
    pieces: [["\"…\"", "les guillemets disent « ceci est du texte »"], ["nomBoutique ≠ nomboutique", "pour JavaScript, ce sont deux noms différents"], ["false ≠ \"false\"", "le premier est un booléen, le second un texte"]],
    trap: "Un texte non vide compte comme « vrai » dans un test. Donc `\"false\"` se comporte comme… vrai !"
  },
  steps: ["Lance le code et lis l’erreur (ligne en rouge).", "Corrige, relance, recommence jusqu’à ce que tout s’affiche.", "Vérifie aussi les types dans l’onglet **Mémoire**."],
  starter: `let nomBoutique = "Pain d'Or";
let horaires = 7h - 19h;
let ouvertLeDimanche = "false";

console.log("Bienvenue chez " + nomboutique);
console.log("Horaires : " + horaires);
console.log(ouvertLeDimanche);
`,
  goals: [
    { label: "Le code tourne sans erreur", test: c => !c.main.error },
    { label: "La console affiche `Bienvenue chez Pain d'Or`", test: c => hasText(c.main, "Bienvenue chez Pain d'Or") },
    { label: "La console affiche `Horaires : 7h - 19h`", test: c => hasText(c.main, "Horaires : 7h - 19h") },
    { label: "`ouvertLeDimanche` est un vrai booléen qui vaut false", test: c => { const v = V(c.main, "ouvertLeDimanche"); if (v === false) return true; return v === "false" ? "`\"false\"` entre guillemets est un texte, pas un booléen." : false; } }
  ],
  hints: ["Il y a 3 bugs : un texte sans guillemets, un nom mal écrit et un faux booléen.", "Ligne 2 : `7h - 19h` n’est pas un calcul, c’est du texte. Ligne 5 : compare les majuscules avec la ligne 1.", "Ligne 3 : `let ouvertLeDimanche = ___;` (sans guillemets)."],
  solution: `let nomBoutique = "Pain d'Or";
let horaires = "7h - 19h";
let ouvertLeDimanche = false;

console.log("Bienvenue chez " + nomBoutique);
console.log("Horaires : " + horaires);
console.log(ouvertLeDimanche);`,
  check: [
    { q: "Pourquoi `\"false\"` (avec guillemets) était un bug ?", opts: ["Les guillemets ralentissent le site", "C’est un texte : dans un test, un texte non vide compte comme vrai", "Ce n’était pas un bug, c’est pareil"], a: 1, why: "Un `if (ouvertLeDimanche)` aurait été vrai avec le texte \"false\" : le site aurait affiché « Ouvert le dimanche ». Les guillemets changent le type, donc le comportement." },
    { q: "Pourquoi `nomboutique` provoquait une erreur ?", opts: ["Les majuscules comptent : JavaScript ne connaît que `nomBoutique`", "Les noms de variables ne doivent pas dépasser 10 lettres", "Il fallait des guillemets autour"], a: 0, why: "Pour JavaScript, `nomBoutique` et `nomboutique` sont deux noms différents. Le second n’a jamais été créé : « is not defined »." }
  ],
  debrief: "Trois bugs, trois règles : guillemets pour le texte, noms identiques au caractère près, booléens sans guillemets. Tu viens de faire ce que font les développeurs tous les jours : lire l’erreur, comprendre, corriger."
},
{
  id: "pain-mission", ch: 1, type: "real", title: "La bannière du jour", notion: "concaténation",
  bip: "Première vraie commande ! La boulangère veut une bannière « Produit du jour » qu’elle peut changer elle-même. Le site lira tes variables.",
  where: { text: "La bannière en haut du site lit trois variables. La boulangère ne touche jamais au HTML : elle change juste les valeurs.", tags: [["Pain au chocolat", "produitDuJour"], ["1,40 €", "prixDuJour"], ["Plus que 4 !", "reste"]] },
  why: "Séparer les **données** (les valeurs) de l’**affichage** (la page), c’est le principe de tous les sites : on change le contenu sans casser la mise en page.",
  lesson: {
    what: "Pour fabriquer une phrase avec des variables, on colle les morceaux avec `+`. Les espaces font partie du texte : ils vont **dans** les guillemets.",
    code: `const nom = "Léa";\nconsole.log("Bonjour " + nom + " !");   // Bonjour Léa !`,
    pieces: [["\"Bonjour \"", "un morceau de texte, avec l’espace à la fin"], ["+ nom +", "la valeur de la variable, insérée au milieu"], ["\" !\"", "la fin de la phrase"]],
    trap: "`\"Bonjour\" + nom` donne « BonjourLéa » : sans espace dans les guillemets, les mots se collent."
  },
  steps: ["Crée une variable `produitDuJour` (du texte) et une variable `prixDuJour` (un nombre).", "Crée une variable `reste` : le nombre de pièces encore disponibles.", "Affiche dans la console `Produit du jour : Pain au chocolat à 1.4 €` en collant le texte et **tes variables** avec `+`.", "Regarde l’onglet **Aperçu du site** : la bannière utilise tes variables."],
  starter: `// Les données de la bannière\n\n\n// Le message\n`,
  goals: [
    { label: "`produitDuJour` contient un texte", test: c => typeof V(c.main, "produitDuJour") === "string" && V(c.main, "produitDuJour").trim() !== "" },
    { label: "`prixDuJour` contient un nombre", test: c => { const v = V(c.main, "prixDuJour"); if (typeof v === "number") return true; return typeof v === "string" ? "`prixDuJour` est entre guillemets : c’est du texte." : false; } },
    { label: "`reste` contient un nombre", test: c => typeof V(c.main, "reste") === "number" },
    { label: "La console affiche la phrase complète, fabriquée avec tes variables", test: c => { const p = V(c.main, "produitDuJour"), x = V(c.main, "prixDuJour"); if (typeof p !== "string") return false; if (!/console\.log\([^;]*produitDuJour[^;]*prixDuJour/.test(c.code)) return "Le message doit utiliser les variables `produitDuJour` et `prixDuJour`, pas du texte recopié."; return hasText(c.main, "Produit du jour : " + p + " à " + x + " €") || "Presque ! Vérifie les espaces et les mots : `Produit du jour : ` … ` à ` … ` €`."; } }
  ],
  render: r => { const v = r.vars; if (typeof v.produitDuJour !== "string") return null; const rest = typeof v.reste === "number" ? (v.reste < 5 ? "Plus que " + v.reste + " !" : v.reste + " disponibles") : ""; return `<div class="mk mk-banner"><div class="mk-body mk-col"><p class="mk-kicker">Produit du jour</p><p class="mk-h">${esc(v.produitDuJour)}</p><p class="mk-price">${esc(String(v.prixDuJour).replace(".", ","))} €</p><p class="mk-small">${esc(rest)}</p></div></div>`; },
  hints: ["Trois lignes avec `let` (ou `const`) au début : une par donnée.", "Le texte avec guillemets, les nombres sans : `let prixDuJour = 1.4;`", "Le message : `console.log(\"Produit du jour : \" + ___ + \" à \" + ___ + \" €\");`"],
  solution: `// Les données de la bannière
let produitDuJour = "Pain au chocolat";
let prixDuJour = 1.4;
let reste = 4;

// Le message
console.log("Produit du jour : " + produitDuJour + " à " + prixDuJour + " €");`,
  check: [
    { q: "Demain, la boulangère change le prix. Combien de lignes de ton code faut-il modifier ?", opts: ["Toutes les lignes où le prix apparaît", "Une seule : celle où on crée `prixDuJour`", "Il faut tout réécrire"], a: 1, why: "Le message et la bannière lisent la variable : on change la valeur à un seul endroit, tout suit." },
    { q: "Pourquoi le message utilise `prixDuJour` et pas directement `1.4` ?", opts: ["Pour que le message reste juste quand la valeur change", "Parce que 1.4 est interdit dans un texte", "C’est pareil"], a: 0, why: "Si on écrit 1.4 en dur, le message mentira dès que le prix changera." }
  ],
  debrief: "Tu as séparé les données de l’affichage : c’est exactement ce que fait un CMS comme Webflow. La boulangère change une valeur, la bannière suit."
},

/* =========================== CLIENT 2 · BOBINE =========================== */
{
  id: "bobine-observer", ch: 2, type: "observe", title: "Le calcul du panier", notion: "opérateurs",
  bip: "Client suivant : une boutique de vêtements. Regarde comment le panier calcule le total, étape par étape.",
  where: { text: "Le récapitulatif d’un panier : chaque ligne est un calcul. La barre « Livraison offerte dès 50 € » est une comparaison.", tags: [["55 €", "total = total + …"], ["Livraison offerte", "total >= 50"]] },
  why: "Le site ne peut pas connaître le total à l’avance : chaque client a un panier différent. Le code doit **calculer** à partir des prix et des quantités.",
  lesson: {
    what: "Les **opérateurs** calculent : `+ - * /`. La multiplication passe avant l’addition, comme en maths. Une **comparaison** (`>=`, `<`, `===`…) donne toujours un booléen.",
    code: `let total = 0;\ntotal = total + 25;        // 25\nconst gratuit = total >= 50;  // false`,
    pieces: [["total = total + 25", "on lit l’ancienne valeur, on ajoute, on range le résultat dans la même boîte"], ["*  /", "prioritaires sur + et -"], [">=", "plus grand ou égal : donne true ou false"]],
    trap: "`const` pour ce qui ne change pas (un prix), `let` pour ce qui change (un total qui grandit)."
  },
  code: `const prixTshirt = 25;
const prixCasquette = 15;
let total = 0;
total = total + prixTshirt;
total = total + prixCasquette * 2;
const livraisonGratuite = total >= 50;
console.log("Total : " + total + " €");
console.log(livraisonGratuite);`,
  notes: {
    3: "Le total commence à 0 : le panier est vide. `let`, car il va changer.",
    4: "JavaScript lit `total` (0), ajoute `prixTshirt` (25), puis range 25 dans `total`.",
    5: "La multiplication d’abord : 15 × 2 = 30. Puis 25 + 30 = 55.",
    6: "`total >= 50` est une question. La réponse (true ou false) est rangée dans `livraisonGratuite`."
  },
  questions: [
    { q: "Après la ligne 4, que vaut `total` ?", opts: ["0", "25", "40"], a: 1, why: "0 + 25 = 25." },
    { q: "Après la ligne 5, que vaut `total` ?", opts: ["80", "55", "65"], a: 1, why: "La multiplication passe avant : 15 × 2 = 30, puis 25 + 30 = 55." },
    { q: "Pourquoi `prixTshirt` est en `const` et `total` en `let` ?", opts: ["`const` est pour les nombres, `let` pour le texte", "Le prix ne change pas, le total grandit à chaque article", "C’est au hasard"], a: 1, why: "`const` protège une valeur fixe ; `let` autorise les changements." },
    { q: "Que contient `livraisonGratuite` ?", opts: ["`true`", "`\"oui\"`", "`55`"], a: 0, why: "Une comparaison donne toujours un booléen. 55 >= 50 est vrai." }
  ],
  debrief: "Tu as vu une variable **grandir** : `total = total + …` lit l’ancienne valeur avant d’écrire la nouvelle. Et une comparaison qui devient un booléen, prêt à être utilisé par le site."
},
{
  id: "bobine-predire", ch: 2, type: "predict", title: "Le stock qui bouge", notion: "calculs et comparaisons",
  bip: "La boutique gère son stock. Devine ce que la console va afficher : attention, chaque ligne part de la valeur **actuelle**.",
  where: { text: "« Plus que 2 en stock ! » sur une fiche produit : à chaque commande, le site retire les articles vendus, puis compare le stock à un seuil.", tags: [["Plus que 2 !", "stock < 3"]] },
  why: "Une variable n’a qu’une valeur à la fois. Pour prédire, il faut suivre ce qu’elle contient à chaque ligne : c’est ce que tu fais de tête, et ce que fait le pas à pas.",
  code: `let stock = 10;
stock = stock - 3;
console.log(stock);
stock = stock * 2;
console.log(stock);
console.log(stock > 10);
console.log(stock === "14");
console.log(10 % 3);`,
  explain: [
    "10 - 3 = 7 : la boîte `stock` contient maintenant 7.",
    "On repart de 7, pas de 10 : 7 × 2 = 14.",
    "14 > 10 est vrai : une comparaison affiche true ou false.",
    "`===` vérifie aussi le type : 14 est un nombre, \"14\" un texte. Donc false.",
    "`%` donne le reste de la division : 10 = 3 × 3 + 1. Il reste 1."
  ],
  debrief: "Le `%` (modulo) sert souvent sur les sites : une ligne sur deux en gris dans un tableau (`index % 2 === 0`), un produit offert tous les 3 achats…"
},
{
  id: "bobine-completer", ch: 2, type: "fill", title: "La livraison offerte", notion: "comparaisons",
  bip: "La boutique offre la livraison **à partir de** 80 €. Complète les cases vides du calcul.",
  where: { text: "La règle « Livraison offerte dès 80 € » sous le bouton Commander : un calcul, puis une comparaison.", tags: [["Total : 80 €", "prix * quantite + fraisDePort"], ["Livraison offerte", "total >= 80"]] },
  why: "« À partir de », « au moins », « plus de » : chaque mot du client correspond à un opérateur précis. Le mauvais opérateur, c’est un client qui paie la livraison alors qu’il ne devrait pas.",
  steps: ["Complète les cases vides directement dans le code.", "Lance pour vérifier.", "Réponds à la question pour valider."],
  template: `const prix = 35;
const quantite = 2;
const fraisDePort = 10;

const total = {{prix * quantite + fraisDePort}};
const livraisonGratuite = total {{>=}} 80;

console.log("À payer : " + {{total}} + " €");
console.log(livraisonGratuite);`,
  goals: [
    { label: "`total` vaut 80", test: c => V(c.main, "total") === 80 || (V(c.main, "total") !== undefined ? "`total` vaut " + fmt(V(c.main, "total"), false) + "." : false) },
    { label: "`livraisonGratuite` vaut true (80 est compris)", test: c => { const v = V(c.main, "livraisonGratuite"); if (v === true) return true; return v === false ? "« À partir de 80 € » inclut 80 : quel opérateur inclut l’égalité ?" : false; } },
    { label: "La console affiche `À payer : 80 €`", test: c => hasText(c.main, "À payer : 80 €") }
  ],
  hints: ["Case 1 : le prix des articles (prix × quantité) plus les frais de port.", "Case 2 : « à partir de 80 » veut dire « plus grand **ou égal** ».", "Case 3 : la variable qui contient le montant à payer."],
  check: [
    { q: "Pourquoi `>=` et pas `>` ?", opts: ["`>` n’existe pas en JavaScript", "« À partir de 80 € » inclut 80 : il faut « plus grand ou égal »", "C’est pareil"], a: 1, why: "Avec `>`, un panier de 80 € pile paierait la livraison. 80 > 80 est faux, 80 >= 80 est vrai." }
  ],
  debrief: "Traduire la phrase du client en opérateur, c’est tout le travail. Les cas limites (pile 80 €) sont ceux qui cassent le plus souvent."
},
{
  id: "bobine-mission", ch: 2, type: "real", title: "Le récap du panier", notion: "calculer avec des variables",
  bip: "Commande de la boutique : un récap de panier avec une remise de 10 %. Attention, le jeu va tester ton code avec **d’autres paniers**.",
  where: { text: "Le bloc récapitulatif avant de payer : sous-total, remise, total, livraison. Il change pour chaque client.", tags: [["Sous-total", "prixArticle * quantite"], ["Remise -10 %", "sousTotal / 10"], ["Livraison offerte", "total >= 50"]] },
  why: "Sur un vrai site, tu ne connais jamais les valeurs à l’avance. Ton code doit marcher pour **tous** les paniers : c’est pour ça qu’on calcule avec des noms, jamais avec des résultats recopiés.",
  prelude: `const prixArticle = 20;\nconst quantite = 3;`,
  scenarios: [
    { prelude: `const prixArticle = 20;\nconst quantite = 3;`, st: 60, liv: true },
    { prelude: `const prixArticle = 15;\nconst quantite = 2;`, st: 30, liv: false, hidden: true },
    { prelude: `const prixArticle = 25;\nconst quantite = 2;`, st: 50, liv: false, hidden: true }
  ],
  steps: ["Crée `sousTotal` : le prix de l’article fois la quantité.", "Crée `remise` : 10 % du sous-total (astuce : 10 %, c’est diviser par 10).", "Crée `total` : le sous-total moins la remise.", "Crée `livraisonOfferte` : true si le total est d’au moins 50 €.", "Affiche le total dans la console."],
  starter: ``,
  goals: [
    { label: "`sousTotal` est juste dans tous les paniers", test: c => allRuns(c, (r, s) => near(V(r, "sousTotal"), s.st) || (s.hidden && V(r, "sousTotal") === 60 ? "Avec un autre panier, `sousTotal` vaut toujours 60 : tu as écrit le nombre au lieu du calcul." : false)) },
    { label: "`remise` vaut 10 % du sous-total", test: c => allRuns(c, (r, s) => near(V(r, "remise"), s.st / 10)) },
    { label: "`total` = sous-total moins remise", test: c => allRuns(c, (r, s) => near(V(r, "total"), s.st - s.st / 10)) },
    { label: "`livraisonOfferte` est juste (dès 50 €)", test: c => allRuns(c, (r, s) => V(r, "livraisonOfferte") === (s.st - s.st / 10 >= 50) || (typeof V(r, "livraisonOfferte") !== "boolean" ? false : "Faux pour un panier à " + (s.st - s.st / 10) + " €.")) },
    { label: "La console affiche le total", test: c => { const r = c.runs[0], t = V(r, "total"); return t !== undefined && (hasArg(r, a => near(a, t)) || logTexts(r).some(x => x.includes(String(t)))); } }
  ],
  render: r => { const v = r.vars; if (typeof v.total !== "number") return null; return `<div class="mk"><div class="mk-bar"><span>bobine.shop/panier</span></div><div class="mk-body mk-col"><div class="mk-line"><span>T-shirt × ${esc(v.quantite)}</span><b>${esc(v.sousTotal)} €</b></div><div class="mk-line"><span>Remise -10 %</span><b>-${esc(v.remise)} €</b></div><div class="mk-line mk-total"><span>Total</span><b>${esc(v.total)} €</b></div>${v.livraisonOfferte === true ? `<span class="mk-badge mk-ok">Livraison offerte</span>` : `<p class="mk-small">Livraison : 4,90 €</p>`}<span class="mk-btn">Payer</span></div></div>`; },
  hints: ["Chaque ligne commence par `const` : `const sousTotal = ...;`", "`const remise = sousTotal / 10;` puis `const total = sousTotal - remise;`", "`const livraisonOfferte = total ___ 50;` (au moins 50)"],
  solution: `const sousTotal = prixArticle * quantite;
const remise = sousTotal / 10;
const total = sousTotal - remise;
const livraisonOfferte = total >= 50;

console.log("Total : " + total + " €");`,
  check: [
    { q: "Pourquoi le jeu teste ton code avec d’autres paniers ?", opts: ["Pour te piéger", "Parce que sur un vrai site chaque client a un panier différent : le code doit calculer, pas recopier un résultat", "Parce que le premier test était faux"], a: 1, why: "Un code qui marche seulement avec les valeurs de l’exemple ne marche pas du tout." },
    { q: "Pourquoi créer `sousTotal` et `remise` au lieu de tout calculer en une ligne ?", opts: ["Chaque étape a un nom : le code se lit comme le récap du panier, et on peut afficher chaque ligne", "C’est obligatoire en JavaScript", "Ça calcule plus vite"], a: 0, why: "Des noms clairs pour chaque étape : c’est plus facile à relire, à vérifier et à afficher." }
  ],
  debrief: "Ton code a marché avec trois paniers différents, dont deux que tu n’as jamais vus. C’est ça, du code fiable : il calcule à partir des données, quelles qu’elles soient."
},

/* =========================== CLIENT 3 · CIEL =========================== */
{
  id: "ciel-observer", ch: 3, type: "observe", title: "Le conseil du jour", notion: "if / else",
  bip: "Nouveau client : une appli météo. Elle donne un conseil différent selon le temps. Regarde le code **choisir son chemin**.",
  where: { text: "Une appli météo choisit le conseil, l’icône et la couleur avec des conditions. Le code ne sait pas le temps qu’il fera : il prévoit tous les cas.", tags: [["Prends un manteau", "if (temperature < 10)"], ["et un parapluie", "if (pluie && …)"]] },
  why: "Un site doit réagir selon la situation : connecté ou pas, panier vide ou pas, il pleut ou pas. Sans conditions, une page afficherait toujours la même chose à tout le monde.",
  lesson: {
    what: "`if` teste une condition. Si elle est vraie, le bloc s’exécute ; sinon, c’est le bloc `else`. Jamais les deux. `&&` veut dire ET, `||` veut dire OU.",
    code: `if (temperature < 10) {\n  conseil = "Prends un manteau";\n} else {\n  conseil = "Un pull suffit";\n}`,
    pieces: [["if (…)", "« si » : la condition donne true ou false"], ["{ … }", "le bloc exécuté si c’est vrai"], ["else", "« sinon »"], ["a && b", "vrai seulement si a ET b sont vrais"], ["a || b", "vrai si au moins un des deux est vrai"]],
    trap: "`if (temperature = 10)` avec un seul `=` range 10 au lieu de comparer !"
  },
  code: `const temperature = 8;
const pluie = true;
let conseil = "";

if (temperature < 10) {
  conseil = "Prends un manteau";
} else {
  conseil = "Un pull suffit";
}

if (pluie && temperature > 0) {
  conseil = conseil + " et un parapluie";
}

console.log(conseil);`,
  notes: {
    3: "Une chaîne vide `\"\"` : la boîte existe, mais ne contient encore aucun texte.",
    5: "Le test va donner true ou false. Regarde la ligne d’explication : le pas à pas affiche le résultat du test.",
    6: "On est entré dans le bloc du if.",
    11: "`&&` : il faut que **les deux** soient vrais : il pleut ET il fait plus de 0°.",
    12: "On ajoute un morceau au conseil existant, avec `+`."
  },
  questions: [
    { q: "Quelle ligne n’est jamais exécutée ?", opts: ["Ligne 6", "Ligne 8", "Ligne 12"], a: 1, why: "8 < 10 est vrai : JavaScript entre dans le if et saute le else. Le pas à pas ne passe jamais par la ligne 8." },
    { q: "Que veut dire `&&` à la ligne 11 ?", opts: ["ET : les deux conditions doivent être vraies", "OU : une seule suffit", "NON"], a: 0, why: "`pluie && temperature > 0` : il faut qu’il pleuve ET qu’il fasse plus de 0°." },
    { q: "Qu’affiche la console ?", opts: ["Prends un manteau", "Prends un manteau et un parapluie", "Un pull suffit et un parapluie"], a: 1, why: "Le premier if choisit « Prends un manteau », le second ajoute « et un parapluie »." }
  ],
  debrief: "Tu as vu le code **sauter** des lignes. Un programme ne s’exécute pas toujours en entier : les conditions décident quel chemin il prend."
},
{
  id: "ciel-predire", ch: 3, type: "predict", title: "Alerte vent", notion: "else if",
  bip: "L’appli affiche un niveau de vent. Devine ce qui s’affiche : attention, plusieurs conditions sont vraies…",
  where: { text: "Les niveaux d’alerte (vert, jaune, orange, rouge) d’un site météo : une chaîne de `else if`, du plus grave au moins grave.", tags: [["Vent fort", "else if (vent > 40)"]] },
  why: "Avec `else if`, JavaScript s’arrête au **premier** test vrai. L’ordre des tests est donc une décision importante.",
  code: `const vent = 45;
if (vent > 80) {
  console.log("Alerte tempête");
} else if (vent > 40) {
  console.log("Vent fort");
} else if (vent > 20) {
  console.log("Venteux");
} else {
  console.log("Calme");
}
console.log("Fin");`,
  explain: [
    "45 > 80 ? Non. 45 > 40 ? Oui : JavaScript exécute ce bloc… puis ignore tous les suivants, même si 45 > 20 est vrai aussi.",
    "Cette ligne est en dehors du if : elle s’exécute dans tous les cas."
  ],
  debrief: "Une chaîne de `else if` exécute **un seul** bloc : le premier dont la condition est vraie. Lance le pas à pas pour voir les tests défiler."
},
{
  id: "ciel-reparer", ch: 3, type: "fix", title: "La canicule invisible", notion: "ordre des conditions",
  bip: "Bug signalé : à 32°, l’appli affiche « Doux » au lieu de « Canicule ». Et un testeur dit que l’appli plante quand il fait froid…",
  where: { text: "Le bandeau d’alerte d’une appli météo. Un mauvais ordre de tests, et l’alerte canicule ne s’affiche jamais.", tags: [["Canicule", "temperature > 30"]] },
  why: "Un bug peut se cacher dans une branche qui ne s’exécute pas pendant tes tests. C’est pour ça qu’on teste **tous** les cas, pas seulement l’exemple.",
  prelude: `const temperature = 32;`,
  scenarios: [
    { prelude: `const temperature = 32;`, exp: "Canicule", label: "32°" },
    { prelude: `const temperature = 20;`, exp: "Doux", label: "20°", hidden: true },
    { prelude: `const temperature = 5;`, exp: "Froid", label: "5°", hidden: true }
  ],
  steps: ["Lance : le code ne plante pas, mais affiche « Doux » à 32°. Utilise le **pas à pas** pour voir quel test est vrai.", "Corrige l’ordre des conditions.", "Le jeu teste aussi 20° et 5° : il y a un deuxième bug caché."],
  starter: `let alerte = "";

if (temperature > 15) {
  alerte = "Doux";
} else if (temperature > 30) {
  alerte = "Canicule";
} else {
  alerte = Froid;
}

console.log(alerte);
`,
  goals: [
    { label: "À 32° : `Canicule`", test: c => V(c.runs[0], "alerte") === "Canicule" || (V(c.runs[0], "alerte") === "Doux" ? "À 32°, `temperature > 15` est vrai en premier : JavaScript s’arrête là." : false) },
    { label: "À 20° : `Doux` (test caché)", test: c => V(c.runs[1], "alerte") === "Doux" },
    { label: "À 5° : `Froid` (test caché)", test: c => { const r = c.runs[2]; if (r.error) return "À 5°, ton code plante : " + r.error.message + ". Une branche jamais exécutée peut cacher une erreur !"; return V(r, "alerte") === "Froid"; } }
  ],
  hints: ["Le pas à pas montre le résultat de chaque test : à 32°, lequel est vrai en premier ?", "Mets le test le plus précis (`> 30`) **avant** le test `> 15`.", "Ligne 8 : `Froid` sans guillemets, JavaScript cherche une variable qui n’existe pas."],
  solution: `let alerte = "";

if (temperature > 30) {
  alerte = "Canicule";
} else if (temperature > 15) {
  alerte = "Doux";
} else {
  alerte = "Froid";
}

console.log(alerte);`,
  check: [
    { q: "Pourquoi `temperature > 30` doit être testé avant `temperature > 15` ?", opts: ["C’est l’ordre des nombres", "JavaScript s’arrête au premier test vrai : à 32°, `> 15` était déjà vrai", "L’ordre ne compte pas"], a: 1, why: "Dans une chaîne de else if, le cas le plus précis passe en premier." },
    { q: "Pourquoi l’erreur `Froid` (sans guillemets) ne se voyait pas à 32° ?", opts: ["JavaScript n’exécute pas le bloc else quand un test avant lui est vrai", "Les erreurs n’apparaissent qu’avec le froid", "Parce que Froid est un mot réservé"], a: 0, why: "Une ligne jamais exécutée ne plante jamais… jusqu’au jour où un utilisateur arrive dans ce cas." }
  ],
  debrief: "Deux leçons de pro : l’ordre des conditions compte, et il faut tester tous les cas. Les tests cachés du jeu font ce que font les testeurs dans une vraie équipe."
},
{
  id: "ciel-mission", ch: 3, type: "real", title: "La carte météo", notion: "conditions combinées",
  bip: "Commande de l’appli Ciel : la carte du jour, avec un message et une alerte. Le jeu va tester 5 météos différentes.",
  where: { text: "La carte principale d’une appli météo : un message adapté et une alerte rouge seulement quand c’est dangereux.", tags: [["Pluie : prends un parapluie", "if (pluie)"], ["Alerte", "vent > 70 || (pluie && temperature < 2)"]] },
  why: "Le client te donne des règles en français. Ton travail : les traduire en conditions, dans le bon ordre, avec les bons `&&` et `||`.",
  prelude: `const temperature = 8;\nconst pluie = true;\nconst vent = 30;`,
  scenarios: [
    { prelude: `const temperature = 8;\nconst pluie = true;\nconst vent = 30;`, msg: "Pluie : prends un parapluie", al: false, label: "8°, pluie, vent 30" },
    { prelude: `const temperature = 28;\nconst pluie = false;\nconst vent = 20;`, msg: "Grand soleil", al: false, label: "28°, sans pluie, vent 20", hidden: true },
    { prelude: `const temperature = 5;\nconst pluie = false;\nconst vent = 90;`, msg: "Froid : couvre-toi", al: true, label: "5°, sans pluie, vent 90", hidden: true },
    { prelude: `const temperature = 1;\nconst pluie = true;\nconst vent = 10;`, msg: "Pluie : prends un parapluie", al: true, label: "1°, pluie, vent 10", hidden: true },
    { prelude: `const temperature = 15;\nconst pluie = false;\nconst vent = 10;`, msg: "Temps doux", al: false, label: "15°, sans pluie, vent 10", hidden: true }
  ],
  steps: ["Crée `message` selon ces règles, dans cet ordre : s’il pleut → `Pluie : prends un parapluie` ; sinon s’il fait 25° ou plus → `Grand soleil` ; sinon s’il fait moins de 10° → `Froid : couvre-toi` ; sinon → `Temps doux`.", "Crée `alerte` (booléen) : vrai si le vent dépasse 70, **ou** s’il pleut **et** qu’il fait moins de 2°.", "Affiche le message. Regarde l’**Aperçu du site**."],
  starter: `let message = "";\n\n`,
  goals: [
    { label: "`message` est juste dans les 5 météos", test: c => allRuns(c, (r, s) => { if (r.error) return "Avec " + s.label + ", ton code plante."; return V(r, "message") === s.msg || (V(r, "message") ? "Avec " + s.label + ", j’attendais « " + s.msg + " »." : false); }) },
    { label: "`alerte` est juste dans les 5 météos", test: c => allRuns(c, (r, s) => V(r, "alerte") === s.al || (typeof V(r, "alerte") === "boolean" ? "Avec " + s.label + ", `alerte` devrait valoir " + s.al + "." : false)) },
    { label: "La console affiche le message", test: c => hasText(c.runs[0], "Pluie : prends un parapluie") }
  ],
  render: r => { const v = r.vars; if (typeof v.message !== "string") return null; return `<div class="mk mk-weather"><div class="mk-body mk-col"><p class="mk-small">Nice · aujourd’hui</p><p class="mk-temp">${esc(v.temperature)}°</p><p class="mk-h">${esc(v.message || "…")}</p><p class="mk-small">Vent : ${esc(v.vent)} km/h</p>${v.alerte === true ? `<span class="mk-badge mk-ko">Alerte météo</span>` : ""}</div></div>`; },
  hints: ["Quatre cas : `if (pluie) { … } else if (…) { … } else if (…) { … } else { … }`", "« 25° ou plus » : `temperature >= 25`. « Moins de 10° » : `temperature < 10`.", "`const alerte = vent > 70 || (pluie && ___);`"],
  solution: `let message = "";

if (pluie) {
  message = "Pluie : prends un parapluie";
} else if (temperature >= 25) {
  message = "Grand soleil";
} else if (temperature < 10) {
  message = "Froid : couvre-toi";
} else {
  message = "Temps doux";
}

const alerte = vent > 70 || (pluie && temperature < 2);
console.log(message);`,
  check: [
    { q: "Dans `vent > 70 || (pluie && temperature < 2)`, que faut-il pour que l’alerte soit vraie ?", opts: ["Du vent fort ET de la pluie ET moins de 2°", "Du vent fort, OU de la pluie avec moins de 2°", "Seulement de la pluie"], a: 1, why: "`||` : un seul côté vrai suffit. Les parenthèses regroupent la pluie et le froid." },
    { q: "Pourquoi écrire `if (pluie)` et pas `if (pluie === true)` ?", opts: ["`pluie` est déjà un booléen : le test est directement vrai ou faux", "`=== true` provoque une erreur", "Pour aller plus vite"], a: 0, why: "Les deux marchent, mais un booléen est déjà une réponse oui/non : pas besoin de le comparer à true." }
  ],
  debrief: "Cinq météos, cinq bons résultats. Tu as traduit des règles métier en conditions : c’est le cœur de la logique de n’importe quelle appli."
},

/* =========================== CLIENT 4 · ONDE =========================== */
{
  id: "onde-observer", ch: 4, type: "observe", title: "La playlist", notion: "tableaux",
  bip: "Client suivant : une appli de musique. Une playlist, c’est une **liste** de titres. En JavaScript, on dit un tableau.",
  where: { text: "Une playlist, un fil d’actualité, les produits d’une catégorie, les messages d’une conversation : ce sont des tableaux. Le site ne sait pas combien il y aura d’éléments, il utilise `length`.", tags: [["4 titres", "playlist.length"], ["Soleil", "playlist[1]"]] },
  why: "Sans tableau, il faudrait une variable par titre : titre1, titre2, titre3… et impossible d’ajouter un titre sans réécrire le code.",
  lesson: {
    what: "Un **tableau** est une liste de valeurs entre `[ ]`. Chaque case a un numéro, l’**index**, qui commence à **0**.",
    code: `const playlist = ["Intro", "Soleil"];\nplaylist[0]           // "Intro"\nplaylist.length       // 2\nplaylist.push("Nuit"); // ajoute à la fin`,
    pieces: [["[0]", "la première case"], [".length", "le nombre d’éléments"], [".push( )", "ajoute un élément à la fin"], [".includes( )", "répond true/false : la valeur est-elle dans le tableau ?"]],
    trap: "Le dernier élément est en `length - 1`, pas en `length`."
  },
  code: `const playlist = ["Intro", "Soleil", "Nuit"];
console.log(playlist[0]);
console.log(playlist.length);
playlist.push("Bonus");
console.log(playlist.length);
const derniere = playlist[playlist.length - 1];
console.log(derniere);
console.log(playlist.includes("Nuit"));`,
  notes: {
    1: "Un tableau de 3 textes. Regarde la Mémoire : chaque titre a son numéro de case, à partir de 0.",
    2: "`[0]` : la case numéro 0, donc le **premier** titre.",
    4: "`push` ajoute « Bonus » à la fin. Le tableau est une `const`, et pourtant on peut le remplir : `const` empêche de remplacer la boîte, pas de changer son contenu.",
    6: "4 titres : les cases vont de 0 à 3. La dernière est donc en `4 - 1 = 3`.",
    8: "`includes` répond à la question « Nuit est-il dans la playlist ? »"
  },
  questions: [
    { q: "À quel index se trouve \"Soleil\" ?", opts: ["0", "1", "2"], a: 1, why: "Intro est en 0, Soleil en 1, Nuit en 2." },
    { q: "Après la ligne 4, combien de titres contient la playlist ?", opts: ["3", "4", "5"], a: 1, why: "`push` a ajouté un titre : 3 + 1 = 4." },
    { q: "Pourquoi `playlist.length - 1` pour le dernier titre ?", opts: ["Parce que les index commencent à 0 : avec 4 titres, le dernier est en case 3", "Parce que le dernier titre ne compte pas", "Pour l’enlever"], a: 0, why: "4 titres, cases 0, 1, 2, 3. La case 4 n’existe pas." }
  ],
  debrief: "L’index qui commence à 0, c’est la règle qui piège tout le monde au début. Retiens : premier = `[0]`, dernier = `[length - 1]`."
},
{
  id: "onde-predire", ch: 4, type: "predict", title: "Les cases du tableau", notion: "index et méthodes",
  bip: "Devine ce que la console affiche. Une des lignes cherche une case qui n’existe pas : que fait JavaScript dans ce cas ?",
  where: { text: "Quand un site affiche « undefined » à la place d’un titre, c’est souvent un index qui vise une case vide.", tags: [["undefined", "notes[3]"]] },
  why: "Savoir ce que renvoie JavaScript dans les cas bizarres (case vide, valeur absente), c’est savoir lire les bugs qu’on voit sur les sites.",
  code: `const notes = [12, 8, 15];
console.log(notes[1]);
console.log(notes[3]);
notes.push(10);
console.log(notes.length);
console.log(notes.includes(8));
console.log(notes[notes.length - 1]);`,
  explain: [
    "Index 1 = la deuxième case : 8.",
    "Il n’y a que les cases 0, 1 et 2. La case 3 n’existe pas : JavaScript renvoie `undefined` (pas d’erreur !).",
    "`push` a ajouté 10 : il y a maintenant 4 notes.",
    "8 est bien dans le tableau : true.",
    "La dernière case (4 - 1 = 3) contient le 10 qu’on vient d’ajouter."
  ],
  debrief: "`undefined` n’est pas une erreur : c’est JavaScript qui dit « il n’y a rien ici ». C’est souvent le signe d’un index décalé de 1."
},
{
  id: "onde-boucle", ch: 4, type: "observe", title: "La lecture en boucle", notion: "forEach",
  bip: "Pour lire tous les titres, on ne va pas écrire une ligne par titre. Regarde la boucle `forEach` tourner, tour après tour.",
  where: { text: "Afficher tous les titres d’une playlist, tous les produits d’un panier, tous les messages d’une conversation : une boucle fait le même travail pour chaque élément.", tags: [["Les 3 titres affichés", "titres.forEach(…)"], ["9 min", "duree = duree + 3"]] },
  why: "Avec 3 titres, on pourrait écrire 3 lignes. Avec 3000, impossible. La boucle fait le même travail pour chaque élément, quel que soit leur nombre.",
  lesson: {
    what: "`forEach` lance une fonction **pour chaque élément** du tableau, dans l’ordre. À chaque tour, le paramètre (ici `titre`) contient l’élément du tour.",
    code: `titres.forEach((titre) => {\n  console.log(titre);\n});`,
    pieces: [["titres.forEach( )", "« pour chaque élément de titres… »"], ["(titre) =>", "le nom du tour en cours, au singulier"], ["{ … }", "le code répété à chaque tour"]],
    trap: "Le code **après** la boucle ne s’exécute qu’une fois, quand tous les tours sont finis."
  },
  code: `const titres = ["Intro", "Soleil", "Nuit"];
let duree = 0;

titres.forEach((titre) => {
  console.log("Lecture : " + titre);
  duree = duree + 3;
});

console.log("Durée totale : " + duree + " min");`,
  notes: {
    4: "La boucle démarre. Le pas à pas va passer **plusieurs fois** par les lignes 5 et 6 : une fois par titre.",
    5: "Regarde la Mémoire : `titre` change à chaque tour (Intro, puis Soleil, puis Nuit).",
    6: "`duree` grandit de 3 à chaque tour. Elle est créée **avant** la boucle, donc elle garde sa valeur d’un tour à l’autre.",
    9: "Tous les tours sont finis : on affiche le total, une seule fois."
  },
  questions: [
    { q: "Combien de fois la ligne 5 est-elle exécutée ?", opts: ["1", "3", "4"], a: 1, why: "Une fois par élément du tableau : 3 titres, 3 tours." },
    { q: "Pendant le 2e tour, que vaut `titre` ?", opts: ["Intro", "Soleil", "titres"], a: 1, why: "Tour 1 : Intro, tour 2 : Soleil, tour 3 : Nuit." },
    { q: "Pourquoi `let duree` est créé avant la boucle ?", opts: ["Pour qu’il garde sa valeur entre les tours ; dedans, il repartirait de 0 à chaque tour", "Parce que forEach interdit let", "Pour aller plus vite"], a: 0, why: "Une variable créée dans la boucle est recréée à chaque tour." }
  ],
  debrief: "Tu as vu la boucle **revenir en arrière** : les lignes 5 et 6 ont tourné 3 fois. Le paramètre `titre` change à chaque tour, `duree` accumule."
},
{
  id: "onde-mission", ch: 4, type: "real", title: "Afficher la playlist", notion: "forEach avec index",
  bip: "Commande de l’appli Onde : la liste numérotée des titres. Le jeu testera aussi une autre playlist.",
  where: { text: "La liste numérotée d’une playlist ou d’un classement (top 10, podium) : un `forEach` avec l’index pour le numéro.", tags: [["1. Intro", "(index + 1) + \". \" + titre"], ["4 titres", "playlist.length"]] },
  why: "L’index commence à 0 pour l’ordinateur, à 1 pour les humains. Tu dois passer de l’un à l’autre à chaque fois que tu affiches un numéro.",
  prelude: `const playlist = ["Intro", "Soleil", "Nuit", "Bonus"];`,
  scenarios: [{ prelude: `const playlist = ["Intro", "Soleil", "Nuit", "Bonus"];` }, { prelude: `const playlist = ["Aube", "Midi"];`, hidden: true }],
  lesson: {
    what: "`forEach` peut donner un deuxième paramètre : l’**index** du tour (0, 1, 2…).",
    code: `noms.forEach((nom, index) => {\n  console.log(index + " : " + nom);\n});`,
    pieces: [["(nom, index)", "l’élément du tour, puis son numéro de case"], ["index + 1", "le numéro « humain », qui commence à 1"]],
    trap: "Sans parenthèses, `index + 1 + \". \"` marche, mais `\". \" + index + 1` colle « 0 » puis « 1 » : écris `(index + 1)`."
  },
  steps: ["Avec `forEach`, affiche chaque titre numéroté : `1. Intro`, `2. Soleil`…", "Crée `nbTitres` : le nombre de titres.", "Affiche `4 titres` (avec la vraie valeur, pas un nombre écrit à la main).", "Regarde l’**Aperçu du site**."],
  starter: ``,
  goals: [
    { label: "Les titres sont affichés numérotés à partir de 1", test: c => allRuns(c, (r, s) => { const p = V(r, "playlist"); const exp = p.map((t, i) => (i + 1) + ". " + t); const got = logTexts(r).filter(t => /^\d+\./.test(t)); if (JSON.stringify(got) === JSON.stringify(exp)) return true; if (got.length && got[0].startsWith("0.")) return "Ta liste commence à 0 : les humains comptent à partir de 1."; return s.hidden && got.length ? "Ça ne marche pas avec une autre playlist : utilise la boucle, pas des lignes écrites à la main." : false; }) },
    { label: "`nbTitres` contient le nombre de titres", test: c => allRuns(c, r => V(r, "nbTitres") === V(r, "playlist").length) },
    { label: "La console affiche `4 titres`", test: c => allRuns(c, r => hasText(r, V(r, "playlist").length + " titres")) },
    { label: "Tu utilises `forEach`", test: c => /\.forEach\s*\(/.test(c.code) }
  ],
  render: r => { const lines = logTexts(r).filter(t => /^\d+\./.test(t)); if (!lines.length) return null; return `<div class="mk mk-dark"><div class="mk-body mk-col"><p class="mk-h">Ma playlist</p><p class="mk-small">${esc(r.vars.nbTitres !== undefined ? r.vars.nbTitres : "?")} titres</p><ol class="mk-list mk-plain">${lines.map(l => `<li>${esc(l)}</li>`).join("")}</ol></div></div>`; },
  hints: ["`playlist.forEach((titre, index) => { … });`", "Dans la boucle : `console.log((index + 1) + \". \" + titre);`", "Après la boucle : `const nbTitres = playlist.length;` puis le message."],
  solution: `playlist.forEach((titre, index) => {
  console.log((index + 1) + ". " + titre);
});

const nbTitres = playlist.length;
console.log(nbTitres + " titres");`,
  check: [
    { q: "Pourquoi écrire `index + 1` ?", opts: ["Pour sauter le premier titre", "Les index commencent à 0, mais les humains comptent à partir de 1", "Parce que index vaut undefined"], a: 1, why: "Le premier tour a l’index 0 : on ajoute 1 pour afficher « 1. »." },
    { q: "Si la playlist a 500 titres, que faut-il changer dans ton code ?", opts: ["Rien : la boucle fait autant de tours qu’il y a de titres", "Ajouter 496 lignes", "Changer le 4 en 500"], a: 0, why: "C’est tout l’intérêt de `forEach` et de `length` : le code ne dépend pas de la taille." }
  ],
  debrief: "Ta boucle a marché avec 4 titres et avec 2. Remplace « titre » par « produit », « article » ou « message » : c’est la même boucle sur tous les sites."
},

/* =========================== CLIENT 5 · LUMEN =========================== */
{
  id: "lumen-observer", ch: 5, type: "observe", title: "La fiche d’une photo", notion: "objets",
  bip: "Notre cliente est photographe. Une photo a plusieurs infos : titre, année, catégorie, likes. Pour les ranger ensemble, on utilise un **objet**.",
  where: { text: "Chaque carte d’une galerie (photo, produit, article de blog) est un objet. Les CMS comme Webflow rangent leurs contenus exactement comme ça : un champ = une propriété.", tags: [["Port de Nice", "photo.titre"], ["♥ 120", "photo.likes"]] },
  why: "Un objet garde toutes les infos d’une même chose sous un seul nom. Sans objet, il faudrait `titrePhoto1`, `anneePhoto1`, `titrePhoto2`… impossible à gérer.",
  lesson: {
    what: "Un **objet** range des valeurs sous des étiquettes, les **propriétés**. On lit et on modifie une propriété avec un point.",
    code: `const photo = { titre: "Port", likes: 120 };\nphoto.titre          // "Port"\nphoto.likes = 121;   // modifier`,
    pieces: [["{ }", "les accolades créent l’objet"], ["titre: \"Port\"", "une propriété : nom, deux-points, valeur"], ["photo.titre", "lire une propriété"], ["photo.lieu = …", "ajouter une propriété qui n’existait pas"]],
    trap: "Une virgule entre chaque propriété. Et c’est `titre: \"Port\"`, pas `titre = \"Port\"`."
  },
  code: `const photo = {
  titre: "Port de Nice",
  annee: 2024,
  categorie: "ville",
  likes: 120
};

console.log(photo.titre);
photo.likes = photo.likes + 1;
console.log(photo.likes);
photo.lieu = "Nice";
console.log(photo);`,
  notes: {
    1: "Un objet sur plusieurs lignes : pour JavaScript, c’est une seule instruction, de `{` à `};`. Regarde la Mémoire : une boîte avec 4 étiquettes.",
    8: "`photo.titre` : le point permet d’ouvrir l’objet et de lire une étiquette.",
    9: "Quelqu’un a liké la photo. On lit `photo.likes` (120), on ajoute 1, on range 121 au même endroit.",
    11: "La propriété `lieu` n’existait pas : elle est **ajoutée**. Surveille la Mémoire.",
    12: "Afficher l’objet entier montre toutes ses propriétés."
  },
  questions: [
    { q: "Après la ligne 9, que vaut `photo.likes` ?", opts: ["120", "121", "\"1201\""], a: 1, why: "120 + 1 = 121 : likes est un nombre." },
    { q: "Que fait la ligne 11 ?", opts: ["Elle ajoute une nouvelle propriété `lieu` à l’objet", "Elle provoque une erreur car lieu n’existe pas", "Elle remplace le titre"], a: 0, why: "Écrire dans une propriété qui n’existe pas la crée." },
    { q: "Pourquoi un objet plutôt que 4 variables séparées ?", opts: ["Toutes les infos d’une même photo restent ensemble, sous un seul nom", "C’est plus rapide pour l’ordinateur", "Les variables sont limitées à 3"], a: 0, why: "Un objet = une fiche. Et une liste de fiches, c’est la mission suivante." }
  ],
  debrief: "Un objet, c’est une fiche avec des étiquettes. C’est la forme d’à peu près toutes les données du web : un utilisateur, un produit, une photo, un article."
},
{
  id: "lumen-completer", ch: 5, type: "fill", title: "La liste des fiches", notion: "tableau d’objets",
  bip: "Une galerie, c’est un tableau d’objets : une liste de fiches. Complète le code qui parcourt la galerie.",
  where: { text: "La galerie d’un portfolio, le catalogue d’une boutique, les articles d’un blog : un tableau d’objets, parcouru avec une boucle.", tags: [["Les cartes de la galerie", "photos.forEach(…)"], ["Mont Agel", "photos[1].titre"]] },
  why: "Le tableau dit « combien », chaque objet dit « quoi ». Ensemble, ils décrivent n’importe quelle collection de contenu.",
  steps: ["Complète les cases vides.", "Lance pour vérifier.", "Réponds à la question pour valider."],
  template: `const photos = [
  { titre: "Port de Nice", categorie: "ville" },
  { titre: "Mont Agel", categorie: "nature" },
  { titre: "Cours Saleya", categorie: "ville" }
];

photos.{{forEach}}((photo) => {
  console.log({{photo.titre}});
});

console.log(photos[{{1}}].categorie);`,
  goals: [
    { label: "La console affiche les 3 titres, dans l’ordre", test: c => { const t = logTexts(c.main); if (t.some(x => x.includes("[object Object]") || x.startsWith("{"))) return "Tu affiches la fiche entière : il faut seulement sa propriété `titre`."; return JSON.stringify(t.slice(0, 3)) === JSON.stringify(["Port de Nice", "Mont Agel", "Cours Saleya"]); } },
    { label: "La dernière ligne affiche `nature` (la catégorie de Mont Agel)", test: c => { const t = logTexts(c.main); return t[t.length - 1] === "nature" || (t[t.length - 1] === "ville" ? "Mont Agel est la **2e** fiche : quel est son index ?" : false); } }
  ],
  hints: ["Case 1 : la méthode qui lance une fonction pour chaque élément.", "Case 2 : dans la boucle, `photo` est la fiche du tour. On veut sa propriété titre.", "Case 3 : Mont Agel est la 2e fiche. Les index commencent à 0."],
  check: [
    { q: "Dans la boucle, pourquoi `photo.titre` et pas `photos.titre` ?", opts: ["C’est pareil", "`photo` est la fiche du tour en cours ; `photos` est le tableau entier, qui n’a pas de titre", "`photos.titre` affiche tous les titres d’un coup"], a: 1, why: "Le tableau contient des fiches ; seules les fiches ont un titre." },
    { q: "Dans `photos[1].categorie`, dans quel ordre JavaScript lit-il ?", opts: ["D’abord la case 1 du tableau (une fiche), puis la propriété categorie de cette fiche", "D’abord categorie, puis la case 1", "Il lit tout en même temps"], a: 0, why: "De gauche à droite : on choisit la fiche, puis l’étiquette dans la fiche." }
  ],
  debrief: "`photos` → une fiche avec `[1]` → une info avec `.categorie`. Cette façon de naviguer dans les données, tu vas l’utiliser sur tous tes projets."
},
{
  id: "lumen-predire", ch: 5, type: "predict", title: "Le tri des photos populaires", notion: "filter",
  bip: "La photographe veut afficher ses photos populaires. Devine ce que va afficher ce code avec `filter`.",
  where: { text: "Les filtres d’une galerie (« Nature », « Plus de 100 likes ») ou d’une boutique (« Moins de 50 € », « En stock ») : un `filter` sur un tableau d’objets.", tags: [["Populaires", "photos.filter(…)"]] },
  why: "`filter` est l’outil de tous les filtres que tu vois sur les sites. Comprendre ce qu’il garde, et ce qu’il ne touche pas, évite beaucoup de bugs.",
  code: `const photos = [
  { titre: "Port", likes: 120 },
  { titre: "Mont", likes: 40 },
  { titre: "Plage", likes: 300 }
];
const populaires = photos.filter((photo) => photo.likes > 100);
console.log(populaires.length);
console.log(populaires[0].titre);
console.log(populaires[1].titre);
console.log(photos.length);`,
  explain: [
    "`filter` garde seulement les photos où `photo.likes > 100` est vrai : Port (120) et Plage (300). Donc 2.",
    "Le nouveau tableau commence par Port.",
    "La 2e photo gardée est Plage : Mont a été écartée, donc Plage remonte en case 1.",
    "`filter` crée un **nouveau** tableau : `photos` n’a pas changé, il contient toujours 3 photos."
  ],
  debrief: "`filter` ne modifie jamais l’original : il fabrique un nouveau tableau. C’est pour ça qu’on peut cliquer sur « Tout » et retrouver toute la galerie."
},
{
  id: "lumen-mission", ch: 5, type: "real", title: "La galerie filtrée", notion: "filter et forEach",
  bip: "Commande de Lumen : la page « Nature » de la galerie et une sélection des photos stars. Le jeu testera une autre galerie.",
  where: { text: "Quand on clique sur le filtre « Nature » d’un portfolio, le code fait exactement ça : un `filter`, puis une boucle pour afficher le résultat.", tags: [["Filtre Nature", "photos.filter(…)"], ["Les cartes", "nature.forEach(…)"]] },
  why: "Les données restent les mêmes ; seul l’affichage change selon le filtre choisi. C’est le principe de toutes les galeries et de tous les catalogues.",
  prelude: PHOTOS_A,
  scenarios: [{ prelude: PHOTOS_A }, { prelude: PHOTOS_B, hidden: true }],
  steps: ["Crée `nature` : seulement les photos de la catégorie `\"nature\"`.", "Crée `stars` : seulement les photos qui ont **au moins** 100 likes.", "Avec `forEach`, affiche le titre de chaque photo de `nature`.", "Regarde l’**Aperçu du site** : la galerie affiche ton tableau `nature`."],
  starter: ``,
  goals: [
    { label: "`nature` contient les photos nature", test: c => allRuns(c, (r, s) => { const ph = V(r, "photos"), n = V(r, "nature"); if (!Array.isArray(n)) return false; return JSON.stringify(n.map(p => p && p.titre)) === JSON.stringify(ph.filter(p => p.categorie === "nature").map(p => p.titre)) || (s.hidden ? "Faux avec une autre galerie : utilise `filter`, ne recopie pas les photos." : "`nature` n’a pas les bonnes photos."); }) },
    { label: "`stars` contient les photos à 100 likes ou plus", test: c => allRuns(c, r => { const ph = V(r, "photos"), n = V(r, "stars"); if (!Array.isArray(n)) return false; const got = JSON.stringify(n.map(p => p && p.titre)); if (got === JSON.stringify(ph.filter(p => p.likes >= 100).map(p => p.titre))) return true; return got === JSON.stringify(ph.filter(p => p.likes > 100).map(p => p.titre)) ? "Une photo a pile 100 likes : « au moins 100 » veut dire `>=`." : false; }) },
    { label: "La console affiche les titres des photos nature", test: c => allRuns(c, r => { const n = V(r, "photos").filter(p => p.categorie === "nature").map(p => p.titre); return JSON.stringify(logTexts(r).filter(t => n.includes(t))) === JSON.stringify(n); }) },
    { label: "Tu utilises `filter` et `forEach`", test: c => /\.filter\s*\(/.test(c.code) && /\.forEach\s*\(/.test(c.code) }
  ],
  render: r => { const n = r.vars.nature; if (!Array.isArray(n)) return null; return `<div class="mk"><div class="mk-bar"><span>lumen-photo.fr/nature</span></div><div class="mk-body mk-col"><div class="mk-chips"><span>Tout</span><span>Ville</span><span class="on">Nature</span></div><div class="mk-grid">${n.map((p, i) => `<div class="mk-tile t${(i % 3) + 1}"><b>${esc(p && p.titre)}</b><small>♥ ${esc(p && p.likes)}</small></div>`).join("") || `<p class="mk-small">Aucune photo</p>`}</div></div></div>`; },
  hints: ["`const nature = photos.filter((photo) => ___ );`", "La condition pour nature : `photo.categorie === \"nature\"`. Pour stars : `photo.likes >= 100`.", "`nature.forEach((photo) => { console.log(___); });`"],
  solution: `const nature = photos.filter((photo) => photo.categorie === "nature");
const stars = photos.filter((photo) => photo.likes >= 100);

nature.forEach((photo) => {
  console.log(photo.titre);
});`,
  check: [
    { q: "Après tes `filter`, que contient le tableau `photos` ?", opts: ["Seulement les photos nature", "Toujours toutes les photos : filter crée un nouveau tableau", "Il est vide"], a: 1, why: "L’original ne change pas. C’est ce qui permet de revenir à « Tout »." },
    { q: "Sur le vrai site, quand on clique sur « Nature »…", opts: ["le site charge une autre page HTML écrite à la main", "le CSS cache les photos tout seul", "le code fait un filter sur les photos, puis redessine la galerie avec le résultat"], a: 2, why: "Données → filter → affichage. On verra le « redessiner » avec le DOM dans les prochains clients." }
  ],
  debrief: "`filter` pour choisir, `forEach` pour afficher : c’est le duo de toutes les galeries filtrables, sur tous les sites."
},

/* =========================== CLIENT 6 · CHEZ LOU =========================== */
{
  id: "lou-observer", ch: 6, type: "observe", title: "La machine à TTC", notion: "fonctions",
  bip: "Le restaurant Chez Lou calcule des prix TTC partout. Plutôt que d’écrire le calcul 50 fois, on fabrique une **fonction**. Regarde JavaScript **sauter** dedans.",
  where: { text: "Sur un site de commande en ligne, le même calcul (prix TTC, pourboire, part de chacun) sert pour chaque plat : on l’écrit une fois dans une fonction.", tags: [["22,00 €", "calculerTTC(20)"], ["8,80 €", "calculerTTC(8)"]] },
  why: "Une fonction, c’est un calcul écrit **une fois** et utilisé partout. Si la TVA change, on corrige une seule ligne.",
  lesson: {
    what: "Une **fonction** est un bloc de code avec un nom. On lui donne des valeurs (les **paramètres**), elle **renvoie** un résultat avec `return`. Elle ne s’exécute que quand on l’**appelle**.",
    code: `function calculerTTC(prixHT) {\n  return prixHT + prixHT / 10;\n}\nconst plat = calculerTTC(20);   // 22`,
    pieces: [["function calculerTTC", "on crée la fonction et on lui donne un nom"], ["(prixHT)", "le paramètre : il reçoit la valeur donnée à l’appel"], ["return", "renvoie le résultat à l’endroit de l’appel"], ["calculerTTC(20)", "l’appel : c’est là que la fonction s’exécute"]],
    trap: "Écrire la fonction ne la lance pas : il faut l’appeler, avec des parenthèses."
  },
  code: `function calculerTTC(prixHT) {
  const taxe = prixHT / 10;
  return prixHT + taxe;
}

const plat = calculerTTC(20);
const dessert = calculerTTC(8);
console.log(plat);
console.log(dessert);`,
  notes: {
    1: "La fonction est **rangée** en mémoire. Rien n’est calculé pour l’instant : regarde, le pas à pas va sauter directement à la ligne 6.",
    2: "On est **dans** la fonction. Regarde la Mémoire : `prixHT` contient la valeur donnée à l’appel.",
    3: "`return` renvoie le résultat… et JavaScript **revient** à la ligne de l’appel.",
    6: "Appel ! JavaScript saute dans la fonction avec `prixHT = 20`.",
    7: "Deuxième appel, avec `prixHT = 8` cette fois. La même machine, une autre valeur."
  },
  questions: [
    { q: "Combien de fois la ligne 2 est-elle exécutée ?", opts: ["0", "1", "2"], a: 2, why: "Une fois par appel : lignes 6 et 7." },
    { q: "Pendant l’appel de la ligne 7, que vaut `prixHT` ?", opts: ["20", "8", "undefined"], a: 1, why: "Le paramètre reçoit la valeur donnée entre parenthèses : `calculerTTC(8)`." },
    { q: "Que fait `return` ?", opts: ["Il affiche la valeur dans la console", "Il renvoie la valeur à l’endroit de l’appel, qui la range dans plat ou dessert", "Il recommence la fonction"], a: 1, why: "`return` donne le résultat ; c’est la ligne de l’appel qui décide quoi en faire." }
  ],
  debrief: "Tu as vu le code **faire un aller-retour** : appel → dans la fonction → retour avec le résultat. C’est ce mouvement qu’il faut avoir en tête pour comprendre n’importe quel programme."
},
{
  id: "lou-predire", ch: 6, type: "predict", title: "Afficher ou renvoyer ?", notion: "return vs console.log",
  bip: "Piège classique : deux fonctions qui ont l’air de faire la même chose. Devine ce qui s’affiche.",
  where: { text: "Quand une addition affiche « undefined € » sur un site, c’est souvent une fonction qui a fait un `console.log` au lieu d’un `return`.", tags: [["undefined €", "fonction sans return"]] },
  why: "`console.log` parle au développeur. `return` donne un résultat au reste du code. Les confondre, c’est le bug numéro 1 avec les fonctions.",
  code: `function double(n) {
  return n * 2;
}
function afficherDouble(n) {
  console.log(n * 2);
}

const a = double(5);
const b = afficherDouble(5);
console.log(a);
console.log(b);`,
  explain: [
    "La ligne 9 appelle `afficherDouble(5)` : la fonction **affiche** 10… mais ne renvoie rien. (La ligne 8 n’affiche rien : `double` renvoie sans afficher.)",
    "`a` contient ce que `double(5)` a **renvoyé** : 10.",
    "`afficherDouble` n’a pas de `return` : elle renvoie `undefined`. C’est ce qui a été rangé dans `b`."
  ],
  debrief: "Retiens : une fonction qui calcule doit **renvoyer** (`return`). Afficher, c’est le travail de celui qui l’appelle."
},
{
  id: "lou-reparer", ch: 6, type: "fix", title: "L’addition à undefined", notion: "paramètres et return",
  bip: "Le site de Chez Lou affiche « Addition : undefined € » et « Pourboire : NaN € ». Les clients ne sont pas contents. Trouve les deux bugs.",
  where: { text: "Le ticket de caisse en ligne d’un restaurant. Deux fonctions, deux bugs : un résultat jamais renvoyé, un paramètre jamais donné.", tags: [["undefined", "pas de return"], ["NaN", "paramètre oublié à l’appel"]] },
  why: "`undefined` et `NaN` (Not a Number, « pas un nombre ») sont deux signaux à reconnaître : ils indiquent presque toujours une valeur qui n’est pas arrivée là où on l’attendait.",
  steps: ["Lance et lis la console : `undefined` et `NaN`.", "Utilise le **pas à pas** : regarde ce que contient `total` dans `pourboire`.", "Corrige les deux bugs."],
  starter: `function addition(prixPlat, prixDessert) {
  const total = prixPlat + prixDessert;
}

function pourboire(total) {
  return total / 10;
}

const note = addition(18, 7);
console.log("Addition : " + note + " €");
console.log("Pourboire conseillé : " + pourboire() + " €");
`,
  goals: [
    { label: "La console affiche `Addition : 25 €`", test: c => hasText(c.main, "Addition : 25 €") || (hasText(c.main, "Addition : undefined €") ? "`addition` ne renvoie rien : il manque `return`." : false) },
    { label: "La console affiche `Pourboire conseillé : 2.5 €`", test: c => hasText(c.main, "Pourboire conseillé : 2.5 €") || (logTexts(c.main).some(t => t.includes("NaN")) ? "`pourboire()` est appelée sans valeur : `total` vaut undefined, et undefined / 10 donne NaN." : false) },
    { label: "`addition` marche avec d’autres prix", test: c => { const f = V(c.runs[0], "addition"); return typeof f === "function" && f(10, 5) === 15; } }
  ],
  hints: ["Bug 1 : la fonction `addition` calcule, mais ne renvoie rien.", "Bug 2 : regarde l’appel `pourboire()` : quelle valeur reçoit le paramètre `total` ?", "`return total;` dans addition, et `pourboire(note)` à la dernière ligne."],
  solution: `function addition(prixPlat, prixDessert) {
  const total = prixPlat + prixDessert;
  return total;
}

function pourboire(total) {
  return total / 10;
}

const note = addition(18, 7);
console.log("Addition : " + note + " €");
console.log("Pourboire conseillé : " + pourboire(note) + " €");`,
  check: [
    { q: "Pourquoi `pourboire()` donnait `NaN` ?", opts: ["Parce que 10 est trop petit", "Le paramètre `total` n’a rien reçu, il valait undefined, et undefined / 10 n’est pas un nombre", "Parce que pourboire est un mot réservé"], a: 1, why: "Un paramètre vaut ce qu’on lui donne à l’appel. Rien donné = undefined." },
    { q: "Le `total` de `addition` et le `total` de `pourboire`, est-ce la même variable ?", opts: ["Oui, c’est le même nom", "Non : chaque fonction a ses propres variables, invisibles de l’extérieur", "Ça dépend de l’ordre"], a: 1, why: "Les variables créées dans une fonction n’existent que dans cette fonction. Les valeurs voyagent par les paramètres et le return." }
  ],
  debrief: "Les valeurs entrent dans une fonction par les **paramètres** et en sortent par le **return**. Si l’une des deux portes est oubliée, on obtient undefined ou NaN."
},
{
  id: "lou-mission", ch: 6, type: "real", title: "Partager l’addition", notion: "fonctions fléchées",
  bip: "Commande de Chez Lou : un calculateur pour partager l’addition, pourboire compris. Écris-le avec des fonctions fléchées.",
  where: { text: "Le bouton « Partager l’addition » d’une appli de restaurant : deux petites fonctions qu’on enchaîne.", tags: [["Pourboire 10 %", "ajouterPourboire(total)"], ["Chacun paie", "parPersonne(total, nb)"]] },
  why: "Des petites fonctions qui font chacune une seule chose, c’est plus facile à tester, à réutiliser et à corriger qu’un gros calcul.",
  prelude: `const addition = 80;\nconst convives = 4;`,
  scenarios: [{ prelude: `const addition = 80;\nconst convives = 4;`, exp: 22 }, { prelude: `const addition = 50;\nconst convives = 2;`, exp: 27.5, hidden: true }],
  lesson: {
    what: "Une **fonction fléchée** est une écriture courte, rangée dans une `const`. Sans accolades, le résultat est renvoyé automatiquement.",
    code: `const double = (n) => n * 2;\nconst somme = (a, b) => a + b;\nsomme(2, 3)   // 5`,
    pieces: [["const double", "la fonction est rangée dans une constante"], ["(n)", "les paramètres"], ["=> n * 2", "la flèche « donne » : résultat renvoyé sans écrire return"], ["(a, b)", "plusieurs paramètres, séparés par des virgules"]],
    trap: "`(n) => { n * 2 }` avec accolades et sans `return` renvoie undefined."
  },
  steps: ["Écris `ajouterPourboire` en fonction fléchée : elle reçoit un `total` et renvoie le total plus 10 % (`total / 10`).", "Écris `parPersonne` en fonction fléchée : elle reçoit `total` et `nb`, et renvoie la part de chacun.", "Crée `aPayer` en utilisant **tes deux fonctions** avec `addition` et `convives`.", "Affiche `Chacun paie 22 €` (avec la vraie valeur)."],
  starter: ``,
  goals: [
    { label: "`ajouterPourboire(100)` renvoie 110", test: c => { const f = V(c.runs[0], "ajouterPourboire"); if (typeof f !== "function") return false; if (!near(f(100), 110) || !near(f(50), 55)) return "`ajouterPourboire(100)` renvoie " + fmt(f(100), false) + "."; return /ajouterPourboire\s*=\s*(\([^)]*\)|\w+)\s*=>/.test(c.code) || "Écris-la en fonction fléchée : `const ajouterPourboire = (total) => …`"; } },
    { label: "`parPersonne(90, 3)` renvoie 30", test: c => { const f = V(c.runs[0], "parPersonne"); if (typeof f !== "function") return false; if (f(90, 3) !== 30 || f(10, 4) !== 2.5) return "`parPersonne(90, 3)` renvoie " + fmt(f(90, 3), false) + "."; return /parPersonne\s*=\s*\([^)]*\)\s*=>/.test(c.code) || "Écris-la en fonction fléchée."; } },
    { label: "`aPayer` est juste, et calculé avec tes deux fonctions", test: c => { if (!/ajouterPourboire\s*\(/.test(c.code) || !/parPersonne\s*\(/.test(c.code)) return false; return allRuns(c, (r, s) => near(V(r, "aPayer"), s.exp) || (s.hidden ? "Faux avec une autre table : utilise `addition` et `convives`." : false)); } },
    { label: "La console affiche `Chacun paie 22 €`", test: c => allRuns(c, (r, s) => hasText(r, "Chacun paie " + s.exp + " €")) }
  ],
  render: r => { const v = r.vars; if (typeof v.aPayer !== "number") return null; return `<div class="mk mk-ticket"><div class="mk-body mk-col"><p class="mk-h">Chez Lou</p><p class="mk-small">Table de ${esc(v.convives)}</p><div class="mk-line"><span>Addition</span><b>${esc(v.addition)} €</b></div><div class="mk-line"><span>Avec pourboire</span><b>${typeof v.ajouterPourboire === "function" ? esc(v.ajouterPourboire(v.addition)) : "?"} €</b></div><div class="mk-line mk-total"><span>Chacun paie</span><b>${esc(v.aPayer)} €</b></div></div></div>`; },
  hints: ["Modèle : `const double = (n) => n * 2;`", "`const ajouterPourboire = (total) => total + total / 10;`", "On peut enchaîner : `parPersonne(ajouterPourboire(addition), convives)`. Ou en deux lignes, avec une variable intermédiaire."],
  solution: `const ajouterPourboire = (total) => total + total / 10;
const parPersonne = (total, nb) => total / nb;

const aPayer = parPersonne(ajouterPourboire(addition), convives);
console.log("Chacun paie " + aPayer + " €");`,
  check: [
    { q: "Pourquoi des fonctions plutôt que le calcul écrit directement ?", opts: ["Les calculs sont interdits en dehors des fonctions", "On réutilise le même calcul pour chaque table, et on le corrige à un seul endroit", "Pour que le code soit plus long"], a: 1, why: "Le jour où le pourboire passe à 15 %, une seule ligne change." },
    { q: "Dans `parPersonne(ajouterPourboire(addition), convives)`, quelle fonction s’exécute en premier ?", opts: ["parPersonne", "ajouterPourboire : son résultat devient le premier paramètre de parPersonne", "Les deux en même temps"], a: 1, why: "Comme en maths, on calcule d’abord l’intérieur des parenthèses." }
  ],
  debrief: "Deux fonctions, chacune avec un rôle clair, enchaînées pour obtenir le résultat. C’est comme ça qu’on construit des programmes plus gros : avec des petites briques fiables."
},

/* =========================== CLIENT 7 · PIXA =========================== */
{
  id: "pixa-observer", ch: 7, type: "observe", title: "Le profil qui change", notion: "le DOM",
  bip: "Jusqu’ici, notre code parlait dans la console. Le réseau social Pixa veut que JavaScript change **la page elle-même**. Regarde la page à chaque étape.",
  where: { text: "Sur un profil de réseau social, le pseudo, la bio et le badge vérifié sont modifiés par JavaScript sans recharger la page.", tags: [["@lea.photo", "titre.textContent = …"], ["✓ vérifié", "carte.classList.add(\"verifie\")"]] },
  why: "Sans le DOM, JavaScript parle tout seul dans la console. Avec le DOM, il change ce que le visiteur voit : c’est ce qui rend une page vivante.",
  stage: STAGE_PROFIL,
  lesson: {
    what: "Le **DOM**, c’est la page HTML vue par JavaScript. `document.querySelector` attrape un élément avec un sélecteur CSS. Ensuite, on peut changer son texte ou ses classes.",
    code: `const titre = document.querySelector(".pseudo");\ntitre.textContent = "@lea";\ntitre.classList.add("actif");`,
    pieces: [["document.querySelector(\".pseudo\")", "trouve le premier élément qui a la classe pseudo"], [".textContent = …", "remplace le texte affiché"], [".classList.add( )", "ajoute une classe : le CSS fait le reste"]],
    trap: "Sans le point, `querySelector(\"pseudo\")` cherche une balise `<pseudo>` qui n’existe pas : résultat `null`."
  },
  code: `const titre = document.querySelector(".pseudo");
const bio = document.querySelector(".bio");
const carte = document.querySelector(".profil");
console.log(titre.textContent);
titre.textContent = "@lea.photo";
bio.textContent = "Photographe à Nice";
carte.classList.add("verifie");`,
  notes: {
    1: "`querySelector` cherche dans la page le premier élément avec la classe `pseudo`. La Mémoire va montrer un **élément HTML**, pas un texte.",
    4: "On lit le texte actuel de l’élément : « @utilisateur ».",
    5: "On remplace le texte. Regarde l’aperçu de la page sous la Mémoire !",
    7: "On ajoute la classe `verifie`. Le JavaScript ne dessine rien : c’est le **CSS** qui affiche le badge quand la carte a cette classe."
  },
  questions: [
    { q: "Que contient `titre` après la ligne 1 ?", opts: ["Le texte @utilisateur", "L’élément HTML `<h2 class=\"pseudo\">` de la page", "Le mot \".pseudo\""], a: 1, why: "`querySelector` renvoie l’élément lui-même. Son texte, on le lit avec `.textContent`." },
    { q: "À quelle ligne le badge « Compte vérifié » apparaît-il ?", opts: ["Ligne 5", "Ligne 7", "Il était déjà là"], a: 1, why: "La ligne 7 ajoute la classe ; le CSS affiche alors le badge." },
    { q: "Pourquoi ajouter une classe plutôt que d’écrire le style en JavaScript ?", opts: ["JavaScript ne peut pas changer les couleurs", "Le CSS garde le design, le JS dit seulement « ce compte est vérifié » : chacun son rôle", "C’est obligatoire"], a: 1, why: "Le designer peut changer le badge dans le CSS sans toucher au JavaScript." }
  ],
  debrief: "Attraper (`querySelector`), modifier (`textContent`), signaler un état (`classList`) : avec ces trois gestes, tu peux déjà changer n’importe quelle page."
},
{
  id: "pixa-predire", ch: 7, type: "predict", title: "Ce que renvoie la page", notion: "textContent et null",
  bip: "Devine ce que la console affiche. Deux pièges : le type de `textContent`, et un élément qui n’existe pas.",
  stage: `<p class="compteur">0</p>`,
  where: { text: "Un compteur de likes ou de notifications : sa valeur est lue dans la page… en texte. Et un sélecteur mal écrit renvoie `null`, la cause de la moitié des bugs JavaScript.", tags: [["0", "textContent : toujours du texte"]] },
  why: "Ce que la page te donne est toujours du **texte**. Et quand `querySelector` ne trouve rien, il renvoie `null` : savoir le reconnaître, c’est savoir déboguer.",
  code: `const compteur = document.querySelector(".compteur");
console.log(compteur.textContent);
console.log(typeof compteur.textContent);
compteur.textContent = 5;
console.log(compteur.textContent === "5");
const rien = document.querySelector(".inexistant");
console.log(rien);`,
  explain: [
    "Le texte de l’élément : 0.",
    "`textContent` est **toujours** du texte (string), même s’il ressemble à un nombre.",
    "On a donné le nombre 5, mais la page l’a transformé en texte \"5\". Donc `=== \"5\"` est vrai.",
    "Aucun élément n’a la classe `inexistant` : `querySelector` renvoie `null` (rien). Si on écrivait `rien.textContent`, ce serait l’erreur « Cannot read properties of null »."
  ],
  debrief: "Deux réflexes : ce qui sort de la page est du texte, et `null` veut dire « pas trouvé ». Avec ça, tu comprendras la plupart des erreurs DOM."
},
{
  id: "pixa-completer", ch: 7, type: "fill", title: "Le bouton J’aime", notion: "addEventListener",
  bip: "Le bouton le plus célèbre du web : J’aime. Complète le code, puis clique dessus dans l’onglet Page.",
  stage: `<div class="post">
  <div class="photo-post"></div>
  <div class="actions-post">
    <button class="like">♥ J’aime</button>
    <span class="nb-likes">128</span>
  </div>
</div>`,
  where: { text: "Le cœur sous chaque publication : une variable qui compte, un événement « click », un texte mis à jour et une classe qui colore le cœur.", tags: [["♥", "bouton.addEventListener(\"click\", …)"], ["129", "nombre.textContent = likes"]] },
  why: "Une page réagit aux gestes du visiteur grâce aux **événements**. Sans eux, une page ne pourrait que s’afficher, jamais répondre.",
  lesson: {
    what: "`addEventListener` dit à un élément : « quand tel événement arrive, lance cette fonction ». La fonction s’exécute **à chaque fois**, et seulement à ce moment-là.",
    code: `bouton.addEventListener("click", () => {\n  console.log("Clic !");\n});`,
    pieces: [["\"click\"", "le nom de l’événement"], ["() => { … }", "la fonction lancée à chaque clic"]],
    trap: "Une variable qui doit se souvenir entre deux clics se crée **avant**, en dehors de la fonction."
  },
  steps: ["Complète les cases vides.", "Lance, puis clique sur J’aime dans l’onglet **Page**.", "Réponds aux questions pour valider."],
  template: `const bouton = document.querySelector({{".like"}});
const nombre = document.querySelector(".nb-likes");
let likes = 128;

bouton.addEventListener({{"click"}}, () => {
  likes = {{likes + 1}};
  nombre.textContent = {{likes}};
  bouton.classList.{{add}}("aime");
});`,
  goals: [
    { label: "Au chargement, rien ne change (128)", test: c => txt(freshRun(c).stage, ".nb-likes") === "128" },
    { label: "Après 1 clic : 129 et le cœur devient rouge (classe `aime`)", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".like"); if (!b) return false; b.click(); if (txt(r.stage, ".nb-likes") !== "129") return false; return b.classList.contains("aime") || "Le nombre est bon, mais il manque la classe `aime`."; } },
    { label: "Après 2 clics : 130", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".like"); if (!b) return false; b.click(); b.click(); return txt(r.stage, ".nb-likes") === "130"; } }
  ],
  hints: ["Case 1 : le sélecteur CSS du bouton (une classe : avec un point).", "Case 2 : le nom de l’événement, entre guillemets. Case 3 : l’ancienne valeur plus un.", "Case 4 : la variable qui contient le nombre. Case 5 : la méthode qui ajoute une classe."],
  check: [
    { q: "Quand la ligne `likes = likes + 1` s’exécute-t-elle ?", opts: ["Une seule fois, au chargement", "À chaque clic sur le bouton, jamais au chargement", "En boucle, tout le temps"], a: 1, why: "Le code dans la fonction attend l’événement." },
    { q: "Pourquoi `let likes` est créé en dehors de la fonction ?", opts: ["Pour garder sa valeur entre deux clics ; dedans, il repartirait de 128 à chaque clic", "Les fonctions n’acceptent pas let", "C’est pareil"], a: 0, why: "Variable dehors = mémoire qui dure. Variable dedans = recréée à chaque appel." }
  ],
  debrief: "Variable dehors, mise à jour dedans, affichage dans le DOM : ce trio est la base de toute interface, du J’aime au panier d’une boutique."
},
{
  id: "pixa-mission", ch: 7, type: "real", title: "Le mode sombre", notion: "classList.toggle",
  bip: "Commande de Pixa : un bouton pour passer en mode sombre, et revenir en mode clair. Le design est déjà prêt dans le CSS.",
  stage: `<div class="app">
  <p class="app-titre">Pixa</p>
  <p class="app-texte">Ton fil d’actualité</p>
  <button class="theme">Mode sombre</button>
</div>`,
  where: { text: "Le bouton lune/soleil de presque toutes les applis : une classe ajoutée ou retirée sur la page, et tout le CSS change.", tags: [["Mode sombre", "app.classList.toggle(\"sombre\")"]] },
  why: "JavaScript change un **état** (une classe), le CSS change l’**apparence**. On peut refaire tout le design du mode sombre sans toucher une ligne de JavaScript.",
  lesson: {
    what: "`classList.toggle` ajoute la classe si elle est absente, et l’enlève si elle est là. `classList.contains` répond true ou false.",
    code: `app.classList.toggle("sombre");\nif (app.classList.contains("sombre")) {\n  // la classe est là\n}`,
    pieces: [[".toggle( )", "interrupteur : on / off"], [".contains( )", "pose la question : la classe est-elle là ?"]],
    trap: "`contains` donne un booléen : on peut le mettre directement dans un `if`."
  },
  steps: ["Au clic sur `.theme`, ajoute ou enlève la classe `sombre` sur `.app`.", "Si `.app` a la classe `sombre`, le bouton affiche `Mode clair`, sinon `Mode sombre`.", "Teste dans l’onglet **Page** en cliquant plusieurs fois."],
  starter: `const app = document.querySelector(".app");\nconst bouton = document.querySelector(".theme");\n\n`,
  goals: [
    { label: "Après 1 clic : l’app est sombre et le bouton dit `Mode clair`", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".theme"), a = r.stage.querySelector(".app"); if (!b) return false; b.click(); if (!a.classList.contains("sombre")) return false; return norm(b.textContent) === "Mode clair" || "L’app est sombre, mais le bouton ne dit pas « Mode clair »."; } },
    { label: "Après 2 clics : retour en clair et `Mode sombre`", test: c => { const r = freshRun(c); const b = r.stage.querySelector(".theme"), a = r.stage.querySelector(".app"); if (!b) return false; b.click(); b.click(); if (a.classList.contains("sombre")) return "Au 2e clic, la classe doit partir : `classList.toggle` fait les deux."; return norm(b.textContent) === "Mode sombre"; } },
    { label: "Tu écoutes le clic avec `addEventListener`", test: c => /addEventListener\s*\(\s*["']click["']/.test(c.code) }
  ],
  hints: ["`bouton.addEventListener(\"click\", () => { … });`", "Dans la fonction : `app.classList.toggle(\"sombre\");`", "Puis : `if (app.classList.contains(\"sombre\")) { bouton.textContent = ___; } else { … }`"],
  solution: `const app = document.querySelector(".app");
const bouton = document.querySelector(".theme");

bouton.addEventListener("click", () => {
  app.classList.toggle("sombre");

  if (app.classList.contains("sombre")) {
    bouton.textContent = "Mode clair";
  } else {
    bouton.textContent = "Mode sombre";
  }
});`,
  check: [
    { q: "Pourquoi les couleurs du mode sombre sont dans le CSS et pas dans le JS ?", opts: ["Le JS change un état (une classe), le CSS décide du look : on peut changer le design sans toucher au JS", "JavaScript ne connaît pas les couleurs", "Le CSS est plus rapide"], a: 0, why: "Chacun son rôle : c’est ce qui rend un projet facile à maintenir à plusieurs." },
    { q: "Pourquoi le texte du bouton est mis à jour **après** le toggle ?", opts: ["Pour lire l’état qu’on vient de changer, et afficher le bon texte", "L’ordre ne compte pas", "Parce que toggle efface le bouton"], a: 0, why: "Le code s’exécute de haut en bas, même dans une fonction." }
  ],
  debrief: "Un clic, une classe, et toute l’interface change. C’est exactement comme ça que fonctionnent les thèmes, les menus ouverts/fermés, les onglets actifs…"
},

/* =========================== CLIENT 8 · LA GAZETTE =========================== */
{
  id: "gazette-observer", ch: 8, type: "observe", title: "L’envoi du formulaire", notion: "événement submit",
  bip: "La Gazette veut un formulaire d’inscription. Regarde ce qui se passe quand un visiteur tape son e-mail et clique sur S’inscrire. Le jeu simule le clic pour toi.",
  stage: STAGE_NEWS,
  simulate: stage => { stage.querySelector("#email").value = "lea@mail.fr"; submitForm(stage, ".newsletter"); },
  simulateLabel: "Le visiteur tape lea@mail.fr et clique sur S’inscrire. Le formulaire est envoyé : la fonction se réveille.",
  where: { text: "Tous les formulaires d’inscription, de contact ou de connexion fonctionnent ainsi : on écoute l’envoi, on lit les champs, on vérifie, on affiche un message.", tags: [["S’inscrire", "formulaire.addEventListener(\"submit\", …)"], ["lea@mail", "champ.value"], ["Adresse invalide", "if (email.includes(\"@\"))"]] },
  why: "Un formulaire est le seul moyen pour un visiteur de **donner** quelque chose au site. JavaScript le vérifie tout de suite, sans attendre le serveur.",
  lesson: {
    what: "Un formulaire déclenche l’événement `submit` quand on l’envoie. Par défaut, le navigateur **recharge la page** : `event.preventDefault()` l’en empêche. Le texte tapé se lit avec `.value`.",
    code: `formulaire.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const email = champ.value;\n});`,
    pieces: [["\"submit\"", "l’événement « formulaire envoyé » (bouton ou touche Entrée)"], ["event", "un objet qui décrit l’événement"], ["event.preventDefault()", "« ne recharge pas la page »"], ["champ.value", "le texte tapé dans le champ"]],
    trap: "`.value` pour un champ, `.textContent` pour un texte de la page. Pas l’inverse."
  },
  code: `const formulaire = document.querySelector(".newsletter");
const champ = document.querySelector("#email");
const message = document.querySelector(".message");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = champ.value;
  if (email.includes("@")) {
    message.textContent = "Merci, " + email + " est inscrit !";
  } else {
    message.textContent = "Adresse invalide";
  }
});`,
  notes: {
    5: "On branche l’écouteur. Les lignes 6 à 12 ne s’exécutent **pas** maintenant : elles attendent l’envoi du formulaire.",
    6: "On est dans la fonction : le formulaire vient d’être envoyé. Première chose : empêcher le rechargement de la page.",
    7: "On lit le texte tapé **maintenant**, au moment de l’envoi.",
    8: "`includes(\"@\")` marche aussi sur un texte : « contient-il un @ ? »",
    9: "Le message s’affiche sous le formulaire : regarde l’aperçu de la page."
  },
  questions: [
    { q: "Quand la ligne 6 (`event.preventDefault()`) s’exécute-t-elle ?", opts: ["Au chargement de la page", "Seulement quand le formulaire est envoyé", "Jamais"], a: 1, why: "Elle est dans la fonction de l’écouteur : elle attend l’événement submit." },
    { q: "À quoi sert `event.preventDefault()` ?", opts: ["À vérifier l’adresse", "À empêcher le navigateur de recharger la page à l’envoi", "À effacer le champ"], a: 1, why: "Sans ça, la page se recharge et notre message disparaît aussitôt." },
    { q: "Que contient `email` à la ligne 8 ?", opts: ["L’élément input", "Le texte tapé par le visiteur : lea@mail.fr", "Toujours une chaîne vide"], a: 1, why: "`champ.value` donne le contenu du champ au moment où on le lit." }
  ],
  debrief: "Le pas à pas a montré les deux temps d’un programme web : ce qui s’exécute **au chargement** (préparer, brancher les écouteurs) et ce qui s’exécute **plus tard**, quand le visiteur agit."
},
{
  id: "gazette-reparer", ch: 8, type: "fix", title: "L’inscription fantôme", notion: "lire au bon moment",
  bip: "Bug sur La Gazette : quoi qu’on tape, le site répond « Écris ton adresse ». Et la page se recharge. Deux bugs, à toi.",
  stage: STAGE_NEWS,
  where: { text: "Le formulaire d’inscription qui « ne voit pas » ce qu’on a tapé : un bug très courant, dû à une valeur lue trop tôt.", tags: [["Écris ton adresse", "email lu au chargement"]] },
  why: "Dans une page web, le **moment** où une ligne s’exécute compte autant que ce qu’elle fait. Lire un champ avant que le visiteur ait tapé, c’est lire du vide.",
  steps: ["Lance, puis teste dans l’onglet **Page** : tape une adresse et clique sur S’inscrire.", "Utilise le **pas à pas** : à quel moment la ligne `const email = champ.value` s’exécute-t-elle ?", "Corrige les deux bugs."],
  starter: `const formulaire = document.querySelector(".newsletter");
const champ = document.querySelector("#email");
const message = document.querySelector(".message");
const email = champ.value;

formulaire.addEventListener("submit", () => {
  if (email === "") {
    message.textContent = "Écris ton adresse";
  } else {
    message.textContent = "Inscription de " + email;
  }
});
`,
  goals: [
    { label: "Avec une adresse tapée : `Inscription de lea@mail.fr`", test: c => { const r = freshRun(c); r.stage.querySelector("#email").value = "lea@mail.fr"; submitForm(r.stage, ".newsletter"); const t = txt(r.stage, ".message"); if (t === "Inscription de lea@mail.fr") return true; return t === "Écris ton adresse" ? "Le site dit que le champ est vide alors qu’il est rempli : `email` a été lu au chargement, quand le champ était encore vide." : false; } },
    { label: "La page ne se recharge pas (`preventDefault`)", test: c => { const r = freshRun(c); r.stage.querySelector("#email").value = "a@b.fr"; return submitForm(r.stage, ".newsletter").defaultPrevented || "Sans `event.preventDefault()`, la page se recharge et le message disparaît."; } },
    { label: "Avec le champ vide : `Écris ton adresse`", test: c => { const r = freshRun(c); submitForm(r.stage, ".newsletter"); return txt(r.stage, ".message") === "Écris ton adresse"; } }
  ],
  hints: ["Le pas à pas montre que `const email = champ.value` s’exécute au chargement, quand le champ est vide.", "Déplace la lecture de `champ.value` **dans** la fonction de l’écouteur.", "Ajoute le paramètre `event` à la fonction, puis `event.preventDefault();` en première ligne."],
  solution: `const formulaire = document.querySelector(".newsletter");
const champ = document.querySelector("#email");
const message = document.querySelector(".message");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = champ.value;
  if (email === "") {
    message.textContent = "Écris ton adresse";
  } else {
    message.textContent = "Inscription de " + email;
  }
});`,
  check: [
    { q: "Pourquoi lire `champ.value` dans la fonction et pas au début du fichier ?", opts: ["`value` ne marche que dans les fonctions", "Au chargement le champ est vide ; il faut lire sa valeur au moment de l’envoi", "C’est pareil"], a: 1, why: "Le début du fichier s’exécute une seule fois, avant que le visiteur tape quoi que ce soit." },
    { q: "D’où vient le paramètre `event` ?", opts: ["Le navigateur le donne à la fonction quand l’événement arrive", "Il faut le créer avec let", "C’est une variable globale"], a: 0, why: "À chaque événement, le navigateur appelle ta fonction et lui passe un objet qui décrit ce qui s’est passé." }
  ],
  debrief: "Lire une valeur **au bon moment** : c’est la différence entre un formulaire qui marche et un formulaire fantôme. Retiens : ce qui dépend du visiteur se lit dans l’écouteur."
},
{
  id: "gazette-compteur", ch: 8, type: "write", title: "Le compteur de caractères", notion: "événement input",
  bip: "La Gazette ajoute un champ « Ton message » limité à 140 caractères. Il faut un compteur qui change **pendant** qu’on tape.",
  stage: `<div class="message-box">
  <label for="texte">Ton message</label>
  <textarea id="texte" rows="3"></textarea>
  <p class="compteur">0 / 140</p>
</div>`,
  where: { text: "Le compteur sous un champ de tweet, de commentaire ou de bio : il se met à jour à chaque lettre et passe au rouge au-delà de la limite.", tags: [["12 / 140", "texte.value.length"], ["en rouge", "classList.add(\"trop\")"]] },
  why: "L’événement `input` permet de réagir **pendant** la saisie, pas seulement à l’envoi. C’est ce qui rend les formulaires agréables : le visiteur sait tout de suite où il en est.",
  lesson: {
    what: "L’événement `input` se déclenche à **chaque modification** d’un champ. Un texte a, comme un tableau, une propriété `length` : son nombre de caractères.",
    code: `champ.addEventListener("input", () => {\n  console.log(champ.value.length);\n});`,
    pieces: [["\"input\"", "à chaque lettre tapée ou effacée"], ["champ.value.length", "le nombre de caractères du texte tapé"], [".classList.remove( )", "enlève une classe (sans erreur si elle n’y est pas)"]],
    trap: "Pense au retour en arrière : si on efface du texte, la classe d’alerte doit partir."
  },
  steps: ["À chaque frappe dans `#texte` (événement `\"input\"`), affiche le nombre de caractères dans `.compteur` sous la forme `12 / 140`.", "Si le nombre dépasse 140, ajoute la classe `trop` à `.compteur` ; sinon, enlève-la.", "Teste dans l’onglet **Page**."],
  starter: `const texte = document.querySelector("#texte");\nconst compteur = document.querySelector(".compteur");\n\n`,
  goals: [
    { label: "Après avoir tapé « Bonjour » : `7 / 140`", test: c => { const r = freshRun(c); typeIn(r.stage, "#texte", "Bonjour", "input"); const t = txt(r.stage, ".compteur"); return t === "7 / 140" || (t === "0 / 140" ? "Le compteur ne bouge pas : écoutes-tu l’événement \"input\" sur #texte ?" : false); } },
    { label: "Au-delà de 140 caractères, `.compteur` a la classe `trop`", test: c => { const r = freshRun(c); typeIn(r.stage, "#texte", "a".repeat(141), "input"); return txt(r.stage, ".compteur") === "141 / 140" && r.stage.querySelector(".compteur").classList.contains("trop"); } },
    { label: "Si on efface, la classe `trop` disparaît", test: c => { const r = freshRun(c); typeIn(r.stage, "#texte", "a".repeat(150), "input"); typeIn(r.stage, "#texte", "ok", "input"); return !r.stage.querySelector(".compteur").classList.contains("trop") && txt(r.stage, ".compteur") === "2 / 140"; } }
  ],
  hints: ["`texte.addEventListener(\"input\", () => { … });`", "Dans la fonction : `const nb = texte.value.length;` puis `compteur.textContent = nb + \" / 140\";`", "`if (nb > 140) { compteur.classList.add(\"trop\"); } else { compteur.classList.___(\"trop\"); }`"],
  solution: `const texte = document.querySelector("#texte");
const compteur = document.querySelector(".compteur");

texte.addEventListener("input", () => {
  const nb = texte.value.length;
  compteur.textContent = nb + " / 140";

  if (nb > 140) {
    compteur.classList.add("trop");
  } else {
    compteur.classList.remove("trop");
  }
});`,
  check: [
    { q: "Pourquoi l’événement `\"input\"` et pas `\"click\"` ?", opts: ["`click` ne marche pas sur un textarea", "`input` se déclenche à chaque modification du champ ; `click` seulement quand on clique", "C’est pareil"], a: 1, why: "On veut réagir à la frappe, pas aux clics." },
    { q: "Pourquoi le `else` avec `remove` est-il nécessaire ?", opts: ["Sinon, une fois passé au rouge, le compteur resterait rouge même après avoir effacé", "Parce que tout if doit avoir un else", "Pour aller plus vite"], a: 0, why: "Une interface doit revenir à la normale quand la situation redevient normale." }
  ],
  debrief: "Tu as fait réagir la page **pendant** la saisie. Même principe pour une barre de recherche qui filtre en direct, ou un mot de passe qui affiche sa solidité."
},
{
  id: "gazette-mission", ch: 8, type: "real", title: "Le formulaire complet", notion: "validation",
  bip: "Commande finale de La Gazette : le formulaire de création de compte, avec ses messages d’erreur. Le jeu va tester 4 cas.",
  stage: `<form class="inscription">
  <label for="prenom">Prénom</label>
  <input id="prenom" type="text">
  <label for="email">E-mail</label>
  <input id="email" type="text">
  <button type="submit">Créer mon compte</button>
  <p class="erreur"></p>
  <p class="succes"></p>
</form>`,
  where: { text: "Le formulaire de création de compte : chaque champ est vérifié, un message clair dit quoi corriger, et un message de bienvenue confirme.", tags: [["Le prénom est obligatoire", "if (prenom === \"\")"], ["Bienvenue Léa !", "succes.textContent"]] },
  why: "Un bon formulaire dit **tout de suite** au visiteur ce qui ne va pas, champ par champ. C’est de l’UX : moins de frustration, plus d’inscriptions.",
  steps: ["À l’envoi du formulaire, empêche le rechargement.", "Si le prénom est vide : `.erreur` affiche `Le prénom est obligatoire`.", "Sinon, si l’e-mail ne contient pas `@` : `.erreur` affiche `Adresse e-mail invalide`.", "Sinon : `.erreur` est vidé et `.succes` affiche `Bienvenue Léa !` (avec le prénom tapé)."],
  starter: `const formulaire = document.querySelector(".inscription");\nconst champPrenom = document.querySelector("#prenom");\nconst champEmail = document.querySelector("#email");\nconst erreur = document.querySelector(".erreur");\nconst succes = document.querySelector(".succes");\n\n`,
  goals: [
    { label: "Prénom vide : `Le prénom est obligatoire`", test: c => { const r = freshRun(c); r.stage.querySelector("#email").value = "lea@mail.fr"; submitForm(r.stage, ".inscription"); return txt(r.stage, ".erreur") === "Le prénom est obligatoire"; } },
    { label: "E-mail sans @ : `Adresse e-mail invalide`", test: c => { const r = freshRun(c); r.stage.querySelector("#prenom").value = "Léa"; r.stage.querySelector("#email").value = "lea.mail.fr"; submitForm(r.stage, ".inscription"); return txt(r.stage, ".erreur") === "Adresse e-mail invalide"; } },
    { label: "Tout est bon : `Bienvenue Léa !` et plus d’erreur", test: c => { const r = freshRun(c); const f = r.stage; f.querySelector("#prenom").value = "Léa"; f.querySelector("#email").value = "x"; submitForm(f, ".inscription"); f.querySelector("#email").value = "lea@mail.fr"; submitForm(f, ".inscription"); if (txt(f, ".succes") !== "Bienvenue Léa !") return false; return txt(f, ".erreur") === "" || "Le message d’erreur d’avant est resté affiché : vide `.erreur` quand tout est bon."; } },
    { label: "Ça marche avec un autre prénom (test caché)", test: c => { const r = freshRun(c); r.stage.querySelector("#prenom").value = "Axel"; r.stage.querySelector("#email").value = "axel@mail.fr"; submitForm(r.stage, ".inscription"); return txt(r.stage, ".succes") === "Bienvenue Axel !"; } },
    { label: "La page ne se recharge pas", test: c => submitForm(freshRun(c).stage, ".inscription").defaultPrevented }
  ],
  hints: ["Le squelette : `formulaire.addEventListener(\"submit\", (event) => { event.preventDefault(); … });`", "Dans la fonction, lis les deux champs : `const prenom = champPrenom.value;` puis trois cas : `if … else if … else`.", "Cas 2 : `!email.includes(\"@\")` (le `!` veut dire « ne… pas »). Cas 3 : `erreur.textContent = \"\";` et `succes.textContent = \"Bienvenue \" + prenom + \" !\";`"],
  solution: `const formulaire = document.querySelector(".inscription");
const champPrenom = document.querySelector("#prenom");
const champEmail = document.querySelector("#email");
const erreur = document.querySelector(".erreur");
const succes = document.querySelector(".succes");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const prenom = champPrenom.value;
  const email = champEmail.value;

  if (prenom === "") {
    erreur.textContent = "Le prénom est obligatoire";
  } else if (!email.includes("@")) {
    erreur.textContent = "Adresse e-mail invalide";
  } else {
    erreur.textContent = "";
    succes.textContent = "Bienvenue " + prenom + " !";
  }
});`,
  check: [
    { q: "Pourquoi vérifier le formulaire en JavaScript ?", opts: ["Pour remplacer la sécurité du serveur", "Pour prévenir le visiteur tout de suite, sans attendre une réponse du serveur", "HTML ne sait pas faire de formulaire"], a: 1, why: "Bonus pro : le serveur doit **aussi** vérifier, car n’importe qui peut contourner le JavaScript d’une page." },
    { q: "Que veut dire le `!` dans `!email.includes(\"@\")` ?", opts: ["NON : vrai quand l’e-mail ne contient PAS de @", "Attention, c’est important", "Égal"], a: 0, why: "`!` inverse un booléen : true devient false et inversement." }
  ],
  debrief: "Écouter, lire, vérifier, répondre : tu as codé un vrai formulaire d’inscription, avec la logique qu’on trouve sur tous les sites."
},

/* =========================== CLIENT 9 · PANIER MALIN =========================== */
{
  id: "malin-observer", ch: 9, type: "observe", title: "Fabriquer la liste", notion: "createElement",
  bip: "Dernier client : une appli de liste de courses. Ici, le HTML est presque vide : c’est JavaScript qui **fabrique** les éléments. Regarde-les apparaître.",
  stage: `<h2>Mes courses</h2>\n<ul class="liste"></ul>`,
  where: { text: "Une liste de courses, un fil Instagram, des résultats de recherche, une galerie : le site fabrique un élément HTML pour chaque donnée du tableau.", tags: [["Pain, Lait, Pommes", "articles.forEach(…)"], ["chaque ligne", "document.createElement(\"li\")"]] },
  why: "Le HTML ne peut pas savoir à l’avance combien d’articles il y aura. JavaScript fabrique autant d’éléments qu’il y a de données.",
  lesson: {
    what: "`document.createElement` fabrique un élément en mémoire. On le remplit, puis `appendChild` l’accroche dans la page : c’est seulement là qu’il devient visible.",
    code: `const li = document.createElement("li");\nli.textContent = "Pain";\nliste.appendChild(li);`,
    pieces: [["createElement(\"li\")", "crée une balise li, invisible pour l’instant"], ["li.textContent = …", "on la remplit"], ["liste.appendChild(li)", "on l’accroche à la fin de la liste : elle apparaît"]],
    trap: "Sans `appendChild`, l’élément existe mais reste invisible."
  },
  code: `const liste = document.querySelector(".liste");
const articles = ["Pain", "Lait", "Pommes"];

articles.forEach((article) => {
  const li = document.createElement("li");
  li.textContent = article;
  liste.appendChild(li);
});`,
  notes: {
    5: "Un nouveau `li` est fabriqué. Regarde l’aperçu de la page : il n’y est **pas** encore.",
    6: "On le remplit avec l’article du tour.",
    7: "`appendChild` l’accroche dans la liste : **maintenant** il apparaît sur la page."
  },
  questions: [
    { q: "À quelle ligne le premier article apparaît-il sur la page ?", opts: ["Ligne 5 (createElement)", "Ligne 6 (textContent)", "Ligne 7 (appendChild)"], a: 2, why: "Avant `appendChild`, l’élément n’existe qu’en mémoire." },
    { q: "Combien d’éléments `li` sont fabriqués en tout ?", opts: ["1", "3", "4"], a: 1, why: "Un par tour de boucle, donc un par article." },
    { q: "Pourquoi `createElement` est-il dans le forEach ?", opts: ["Pour fabriquer un nouveau li à chaque article ; sinon on réutiliserait toujours le même", "createElement ne marche que dans une boucle", "Pour aller plus vite"], a: 0, why: "Un élément ne peut être qu’à un seul endroit de la page : il en faut un par article." }
  ],
  debrief: "Fabriquer, remplir, accrocher : tu as vu la page se construire élément par élément. C’est comme ça qu’Instagram affiche ton fil, ou que Webflow affiche une collection."
},
{
  id: "malin-predire", ch: 9, type: "predict", title: "Compter les éléments", notion: "children et innerHTML",
  bip: "Devine combien d’éléments contient la liste à chaque moment. Indice : un élément fabriqué n’est pas forcément sur la page.",
  stage: `<ul class="liste"><li>Pain</li></ul>`,
  where: { text: "Le compteur « 3 articles » d’une liste, ou le bouton « Tout effacer » : ils lisent et vident le contenu d’un élément.", tags: [["3 articles", "liste.children.length"], ["Tout effacer", "liste.innerHTML = \"\""]] },
  why: "Savoir **quand** un élément est vraiment dans la page t’évite de chercher pendant une heure pourquoi « ça ne s’affiche pas ».",
  code: `const liste = document.querySelector(".liste");
console.log(liste.children.length);
const li = document.createElement("li");
li.textContent = "Lait";
console.log(liste.children.length);
liste.appendChild(li);
console.log(liste.children.length);
liste.innerHTML = "";
console.log(liste.children.length);`,
  explain: [
    "`children` = les éléments à l’intérieur de la liste. Au départ, un seul : Pain.",
    "Le `li` Lait est fabriqué, mais pas encore accroché : la liste en contient toujours 1.",
    "Après `appendChild`, il est dans la liste : 2.",
    "`innerHTML = \"\"` vide tout le contenu de la liste : 0."
  ],
  debrief: "`createElement` fabrique, `appendChild` accroche, `innerHTML = \"\"` vide. Ces trois gestes suffisent pour redessiner n’importe quelle liste."
},
{
  id: "malin-completer", ch: 9, type: "fill", title: "La fonction afficher", notion: "redessiner la page",
  bip: "Une appli redessine sa liste à chaque changement. Complète la fonction `afficher`. Attention : elle est appelée **deux fois**.",
  stage: `<ul class="liste"></ul>`,
  where: { text: "Chaque fois que la liste change (ajout, suppression, filtre), l’appli appelle la même fonction qui vide et redessine tout. C’est le principe de React, Vue et des CMS.", tags: [["La liste à jour", "afficher()"]] },
  why: "Plutôt que de modifier la page petit bout par petit bout, on garde les données dans un tableau et on **redessine** à partir de lui. Moins de bugs, une seule source de vérité.",
  steps: ["Complète les cases vides.", "Lance : la liste doit contenir exactement 3 articles, même si `afficher` est appelée deux fois.", "Réponds aux questions pour valider."],
  template: `const ul = document.querySelector(".liste");
const courses = ["Pain", "Lait"];

function afficher() {
  ul.{{innerHTML = ""}};
  courses.forEach((article) => {
    const li = document.{{createElement("li")}};
    li.textContent = {{article}};
    ul.{{appendChild(li)}};
  });
}

courses.push("Œufs");
afficher();
afficher();`,
  goals: [
    { label: "La liste affiche Pain, Lait, Œufs", test: c => { const lis = [...c.runs[0].stage.querySelectorAll(".liste li")].map(e => norm(e.textContent)); if (lis.length === 6) return "6 articles au lieu de 3 : la liste n’est pas vidée au début d’`afficher`."; return JSON.stringify(lis) === JSON.stringify(["Pain", "Lait", "Œufs"]); } }
  ],
  hints: ["Case 1 : vider le contenu de la liste.", "Case 2 : fabriquer un élément li. Case 3 : l’article du tour.", "Case 4 : accrocher le li dans la liste."],
  check: [
    { q: "Pourquoi vider la liste au début de `afficher` ?", opts: ["Pour effacer le tableau courses", "Sinon chaque appel rajoute les articles à la suite des anciens : on aurait des doublons", "appendChild ne marche que sur une liste vide"], a: 1, why: "On efface l’affichage, pas les données : le tableau `courses` est intact." },
    { q: "Œufs est ajouté au tableau **avant** l’appel d’`afficher`. Pourquoi est-il affiché ?", opts: ["`afficher` lit le tableau au moment où on l’appelle", "Parce que push affiche les éléments", "Par hasard"], a: 0, why: "Le tableau est la source ; l’affichage suit l’état du tableau au moment de l’appel." }
  ],
  debrief: "Données dans un tableau, une fonction qui vide et redessine : c’est l’architecture des applis modernes. Tu viens de la coder toi-même."
},
{
  id: "malin-mission", ch: 9, type: "real", title: "L’appli de courses", notion: "projet final",
  bip: "Mission finale de ton stage : l’appli complète. Un formulaire pour ajouter, une liste qui se redessine, un total. Tu as tout appris pour y arriver.",
  stage: `<form class="ajout">
  <input id="article" type="text" placeholder="Ex : tomates">
  <button type="submit">Ajouter</button>
</form>
<ul class="liste"></ul>
<p class="total">0 article</p>`,
  where: { text: "Toutes les applis de liste (courses, tâches, favoris, panier) suivent ce schéma : un formulaire, un tableau, une fonction qui redessine.", tags: [["Ajouter", "submit → push → afficher()"], ["3 articles", "courses.length"]] },
  why: "Ce projet réunit tout le stage : variables, tableaux, fonctions, conditions, DOM, événements, formulaires. Si tu sais pourquoi chaque ligne est là, tu sais construire une appli.",
  steps: ["Dans `afficher` : vide la liste, fabrique un `li` par article du tableau `courses`, puis affiche le total : `2 articles` (ou `1 article` au singulier).", "À l’envoi du formulaire : empêche le rechargement ; si le champ n’est pas vide, ajoute l’article au tableau, vide le champ et appelle `afficher`.", "Teste dans l’onglet **Page**.", "Bonus (non noté) : au clic sur un article, il se barre (classe `fait`)."],
  starter: `const formulaire = document.querySelector(".ajout");
const champ = document.querySelector("#article");
const liste = document.querySelector(".liste");
const total = document.querySelector(".total");

const courses = [];

function afficher() {
  // 1. vider la liste
  // 2. pour chaque article : créer un li, le remplir, l'accrocher
  // 3. mettre à jour le total
}

formulaire.addEventListener("submit", (event) => {
  // 4. empêcher le rechargement
  // 5. si le champ n'est pas vide : ajouter, vider le champ, réafficher
});
`,
  goals: [
    { label: "Ajouter « tomates » : 1 ligne dans la liste", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", "tomates"); submitForm(r.stage, ".ajout"); const lis = [...r.stage.querySelectorAll(".liste li")].map(e => norm(e.textContent)); return JSON.stringify(lis) === JSON.stringify(["tomates"]); } },
    { label: "Ajouter deux articles : 2 lignes, sans doublon, dans l’ordre", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", "tomates"); submitForm(r.stage, ".ajout"); typeIn(r.stage, "#article", "pain"); submitForm(r.stage, ".ajout"); const lis = [...r.stage.querySelectorAll(".liste li")].map(e => norm(e.textContent)); if (lis.length === 3) return "3 lignes pour 2 articles : la liste n’est pas vidée dans `afficher`."; return JSON.stringify(lis) === JSON.stringify(["tomates", "pain"]); } },
    { label: "Le total affiche `2 articles`", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", "a"); submitForm(r.stage, ".ajout"); const one = txt(r.stage, ".total"); typeIn(r.stage, "#article", "b"); submitForm(r.stage, ".ajout"); if (txt(r.stage, ".total") !== "2 articles") return false; return one === "1 article" || one === "1 articles" || "Avec 1 article, le total affiche « " + one + " »."; } },
    { label: "Le champ est vidé après chaque ajout", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", "tomates"); submitForm(r.stage, ".ajout"); return r.stage.querySelector("#article").value === ""; } },
    { label: "Un champ vide n’ajoute rien", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", ""); submitForm(r.stage, ".ajout"); return r.stage.querySelectorAll(".liste li").length === 0; } },
    { label: "La page ne se recharge pas", test: c => { const r = freshRun(c); typeIn(r.stage, "#article", "x"); return submitForm(r.stage, ".ajout").defaultPrevented; } }
  ],
  hints: ["Dans `afficher` : `liste.innerHTML = \"\";` puis `courses.forEach((article) => { … });` puis `total.textContent = courses.length + \" articles\";`", "Dans l’écouteur : `event.preventDefault();` puis `const texte = champ.value;` et `if (texte !== \"\") { … }`.", "Dans le if : `courses.push(texte);` puis `champ.value = \"\";` puis `afficher();`"],
  solution: `const formulaire = document.querySelector(".ajout");
const champ = document.querySelector("#article");
const liste = document.querySelector(".liste");
const total = document.querySelector(".total");

const courses = [];

function afficher() {
  liste.innerHTML = "";
  courses.forEach((article) => {
    const li = document.createElement("li");
    li.textContent = article;
    li.addEventListener("click", () => {
      li.classList.toggle("fait");
    });
    liste.appendChild(li);
  });

  if (courses.length > 1) {
    total.textContent = courses.length + " articles";
  } else {
    total.textContent = courses.length + " article";
  }
}

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const texte = champ.value;
  if (texte !== "") {
    courses.push(texte);
    champ.value = "";
    afficher();
  }
});`,
  check: [
    { q: "Pourquoi garder les articles dans un tableau `courses` plutôt que d’ajouter directement des li ?", opts: ["Les li ne peuvent pas contenir de texte", "Le tableau est la source de vérité : on peut compter, trier, sauvegarder, puis redessiner la page à partir de lui", "Ce n’est pas utile"], a: 1, why: "Les données d’abord, l’affichage ensuite. Demain, on pourra sauvegarder le tableau ou l’envoyer à un serveur." },
    { q: "Dans quel ordre se passent les choses quand on clique sur Ajouter ?", opts: ["afficher() → push → submit", "Événement submit → preventDefault → lecture du champ → push dans le tableau → afficher()", "Le navigateur recharge la page puis ajoute l’article"], a: 1, why: "C’est le circuit complet d’une interface : événement, lecture, mise à jour des données, affichage." }
  ],
  debrief: "Bravo, stage validé ! Variables, conditions, tableaux, fonctions, DOM, événements, formulaires : tu as construit une appli complète, et tu sais expliquer pourquoi chaque ligne est là."
}
];

const SANDBOX = {
  id: "bac-a-sable", sandbox: true, ch: 0, type: "write", title: "Bac à sable", notion: "essais libres",
  bip: "Ici, pas de client : essaie ce que tu veux. Le **pas à pas** marche aussi sur ton propre code, c’est le meilleur moyen de comprendre ce qu’il fait.",
  stage: `<h2 class="titre">Ma page de test</h2>\n<p class="texte">Modifie-moi avec JavaScript.</p>\n<button class="bouton">Un bouton</button>\n<ul class="liste"></ul>`,
  starter: `// Écris ce que tu veux, puis clique sur Lancer ou sur Pas à pas
const prenoms = ["Inès", "Tom", "Yanis"];
let total = 0;

prenoms.forEach((prenom) => {
  total = total + 1;
  console.log(total + ". " + prenom);
});
`
};
