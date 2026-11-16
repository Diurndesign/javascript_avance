"use strict";
/* =====================================================================
   AJOUTS : schémas sur les missions existantes, nouvelles missions
   (accolades, chemin vers une donnée, length - 1, suppression)
   ===================================================================== */

/* ---------- schémas des missions existantes ---------- */
const DIAGRAM_MAP = {
  "pain-observer": ["variable", "types"], "pain-predire": ["types", "concat"], "pain-reparer": ["types"], "pain-mission": ["concat"],
  "bobine-observer": ["reassign"], "bobine-predire": ["reassign"], "bobine-completer": ["reassign"], "bobine-mission": ["reassign"],
  "ciel-observer": ["if", "blocks-if"], "ciel-predire": ["elseif"], "ciel-reparer": ["elseif"], "ciel-mission": ["elseif"],
  "onde-observer": ["array"], "onde-predire": ["array"], "onde-boucle": ["foreach"], "onde-mission": ["array", "foreach"],
  "lumen-observer": ["object"], "lumen-completer": ["path", "foreach"], "lumen-predire": ["filter"], "lumen-mission": ["filter"],
  "lou-observer": ["function"], "lou-predire": ["returnlog"], "lou-reparer": ["function"], "lou-mission": ["function"],
  "pixa-observer": ["dom"], "pixa-predire": ["dom"], "pixa-completer": ["event"], "pixa-mission": ["event"],
  "gazette-observer": ["form", "event"], "gazette-reparer": ["event"], "gazette-compteur": ["event"], "gazette-mission": ["form"],
  "malin-observer": ["create"], "malin-predire": ["create"], "malin-completer": ["render"], "malin-mission": ["render", "crud"]
};
LEVELS.forEach(l => { if (DIAGRAM_MAP[l.id]) l.diagrams = DIAGRAM_MAP[l.id]; });

/* ---------- nouveaux chapitres (formations internes) ---------- */
CHAPTERS.splice(CHAPTERS.findIndex(c => c.n === 5) + 1, 0, {
  n: 10, formation: true, client: "Le chemin des données", kind: "Formation · récupérer, modifier, supprimer", notions: [".etiquette", "[numéro]", "length - 1", "push / splice / delete"],
  mock: `<div class="mk"><div class="mk-bar"><span>back-office · Produits</span></div><div class="mk-body mk-col"><p class="mk-small">Rayon Viennoiseries</p><div class="mk-line"><span>Croissant</span><b>1,20 € <span class="mk-act">Modifier</span> <span class="mk-act mk-del">Supprimer</span></b></div><div class="mk-line"><span>Pain au chocolat</span><b>1,40 € <span class="mk-act">Modifier</span> <span class="mk-act mk-del">Supprimer</span></b></div><span class="mk-btn">+ Ajouter un produit</span></div></div>`
});
CHAPTERS.splice(CHAPTERS.findIndex(c => c.n === 6) + 1, 0, {
  n: 11, formation: true, client: "Les accolades", kind: "Formation · lire la structure du code", notions: ["{ } bloc", "{ } objet", "});"],
  mock: `<div class="mk mk-dark"><div class="mk-body mk-col mk-codemock"><span>function compter(liste) <i class="c0">{</i></span><span>&nbsp;&nbsp;liste.forEach((note) =&gt; <i class="c1">{</i></span><span>&nbsp;&nbsp;&nbsp;&nbsp;if (note &gt;= 10) <i class="c2">{</i></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reussies++;</span><span>&nbsp;&nbsp;&nbsp;&nbsp;<i class="c2">}</i></span><span>&nbsp;&nbsp;<i class="c1">}</i>);</span><span><i class="c0">}</i></span></div></div>`
});

const BOUTIQUE = {
  nom: "Pain d'Or",
  ville: "Nice",
  rayons: [
    { nom: "Pains", produits: [{ nom: "Baguette", prix: 1.1 }, { nom: "Campagne", prix: 3.5 }] },
    { nom: "Viennoiseries", produits: [{ nom: "Croissant", prix: 1.2 }, { nom: "Pain au chocolat", prix: 1.4 }, { nom: "Chausson", prix: 1.8 }] }
  ]
};
const PATH_STEPS = ["Lis la tâche. La cible est **encadrée en vert** dans les données.", "Écris le chemin en partant de `boutique` : `.etiquette` pour ouvrir un objet `{ }`, `[numéro]` pour choisir une case d’un tableau `[ ]`.", "Clique sur **Suivre le chemin** : le jeu montre chaque étape du trajet, et où tu t’es arrêté si ça bloque."];

function insertAfter(id, levels) { const i = LEVELS.findIndex(l => l.id === id); LEVELS.splice(i + 1, 0, ...levels); }

/* =========================== Ciel : les accolades des if =========================== */
insertAfter("ciel-reparer", [{
  id: "ciel-accolades", ch: 3, type: "fix", title: "Le prix du ciné", notion: "accolades et blocs",
  bip: "Le cinéma partenaire de l’appli Ciel affiche ses tarifs. Selon le client, le prix ne s’affiche pas, ou il est faux. Le coupable : les accolades.",
  diagrams: ["blocks-if"],
  where: { text: "La grille tarifaire d’un cinéma ou d’un musée : plusieurs réductions qui se cumulent. Chaque règle est une boîte à part ; le prix s’affiche après toutes les boîtes.", tags: [["Tarif jeune", "if (age < 18) { … }"], ["Réduc membre", "if (membre) { … }"], ["Prix affiché", "console.log(…) hors des blocs"]] },
  why: "Ce qui est **entre** `{` et `}` ne s’exécute que si la condition est vraie. Mal placer une accolade, c’est enfermer du code dans une boîte qui ne s’ouvre pas toujours. Souvent, il n’y a même pas d’erreur : le code fait juste autre chose.",
  lesson: {
    what: "Chaque `{` ouvre un **bloc**, chaque `}` ferme le dernier bloc encore ouvert. Le code entre les deux appartient au bloc. Pour s’y retrouver : décale de 2 espaces tout ce qui est dans un bloc, et aligne la `}` sous le mot qui a ouvert le bloc.",
    code: `if (age < 18) {\n  prix = 6;          // dans le bloc\n}                    // fin du bloc\nconsole.log(prix);   // hors du bloc : toujours exécuté`,
    pieces: [["{", "ouvre un bloc"], ["}", "ferme le dernier bloc encore ouvert"], ["2 espaces", "tout ce qui est dans un bloc est décalé : on voit la structure d’un coup d’œil"], ["même couleur", "dans l’éditeur, une `{` et sa `}` ont la même couleur. Clique à côté d’une accolade : sa partenaire s’allume"]],
    trap: "Compter les accolades ne suffit pas : il faut qu’elles ferment **au bon endroit**."
  },
  prelude: `const age = 20;\nconst membre = false;`,
  scenarios: [
    { prelude: `const age = 20;\nconst membre = false;`, exp: 10, label: "adulte non membre" },
    { prelude: `const age = 15;\nconst membre = false;`, exp: 6, label: "jeune non membre", hidden: true },
    { prelude: `const age = 30;\nconst membre = true;`, exp: 8, label: "adulte membre", hidden: true },
    { prelude: `const age = 12;\nconst membre = true;`, exp: 4, label: "jeune membre", hidden: true }
  ],
  steps: ["Règles du cinéma : prix de base 10 € ; moins de 18 ans → 6 € ; membre → 2 € de moins, qu’on soit jeune ou adulte. Le prix s’affiche **une fois**, pour tout le monde.", "Lance : il y a d’abord une erreur d’accolade. Corrige-la.", "Ensuite, utilise le **pas à pas** : pourquoi rien ne s’affiche pour un adulte non membre ?", "Regarde les couleurs des accolades dans l’éditeur : une `{` et sa `}` ont la même couleur."],
  starter: `let prix = 10;

if (age < 18) {
  prix = 6;

if (membre) {
  prix = prix - 2;
  console.log("Prix : " + prix + " €");
}
}
}
`,
  goals: [
    { label: "Le code tourne sans erreur", test: c => !c.main.error },
    { label: "Le prix s’affiche une seule fois, pour tous les clients", test: c => allRuns(c, (r, s) => { if (r.error) return false; const n = logTexts(r).filter(t => t.startsWith("Prix")).length; if (n === 1) return true; return n === 0 ? "Pour un " + s.label + ", rien ne s’affiche : le `console.log` est enfermé dans un bloc qui ne s’ouvre pas pour lui." : "Le prix s’affiche " + n + " fois."; }) },
    { label: "Le prix est juste dans les 4 cas", test: c => allRuns(c, (r, s) => { if (r.error) return false; if (hasText(r, "Prix : " + s.exp + " €")) return true; const t = logTexts(r).find(x => x.startsWith("Prix")); if (!t) return false; return "Pour un " + s.label + ", j’attendais « Prix : " + s.exp + " € » et pas « " + t + " »." + (s.label === "adulte membre" ? " La réduction membre est-elle enfermée dans le bloc des moins de 18 ans ?" : ""); }) }
  ],
  hints: ["Il y a une `}` de trop à la fin : JavaScript ne sait pas quel bloc elle ferme.", "Le bloc `if (age < 18) {` ne se ferme qu’après le bloc membre : le test membre est **enfermé** dedans. Ferme le premier bloc juste après `prix = 6;`.", "Le `console.log` va tout en bas, **après** toutes les `}`, sans décalage."],
  solution: `let prix = 10;

if (age < 18) {
  prix = 6;
}

if (membre) {
  prix = prix - 2;
}

console.log("Prix : " + prix + " €");`,
  check: [
    { q: "Pourquoi le prix ne s’affichait pas pour un adulte non membre ?", opts: ["Parce qu’un adulte paie toujours 10 €", "Le console.log était dans le bloc `if (membre)`, qui ne s’ouvre que pour les membres", "console.log ne marche pas dans un if"], a: 1, why: "Ce qui est entre { et } ne s’exécute que si la condition est vraie." },
    { q: "Comment savoir à quel bloc appartient une ligne ?", opts: ["On cherche la `{` ouverte au-dessus d’elle et pas encore fermée : la ligne est dans ce bloc", "Toutes les lignes après un if sont dans le if", "On compte les lignes"], a: 0, why: "Le décalage de 2 espaces et la couleur des accolades rendent ça visible." }
  ],
  debrief: "Les accolades dessinent des boîtes. Une ligne s’exécute seulement si toutes les boîtes qui l’entourent s’ouvrent. Bien ranger ses accolades (et décaler son code), c’est rendre ces boîtes visibles."
}]);

/* =========================== Onde : length - 1 =========================== */
insertAfter("onde-predire", [{
  id: "onde-dernier", ch: 4, type: "predict", title: "Pourquoi length - 1 ?", notion: "index et length",
  bip: "`length - 1`, tout le monde l’écrit, peu de gens savent pourquoi. Avec ce code, tu vas le comprendre une bonne fois pour toutes. Regarde d’abord le schéma.",
  diagrams: ["array"],
  where: { text: "« Dernier titre écouté », « dernier message », « dernière photo publiée » : le site vise la dernière case avec `length - 1`, parce qu’il ne connaît jamais la taille à l’avance.", tags: [["Dernier message", "messages[messages.length - 1]"]] },
  why: "`length` **compte** les éléments (à partir de 1). Les index **numérotent** les cases (à partir de 0). Il y a toujours un décalage de 1 entre les deux : le dernier numéro est `length - 1`.",
  code: `const file = ["Léa", "Tom", "Inès", "Axel"];
console.log(file.length);
console.log(file[file.length]);
console.log(file[file.length - 1]);
file.push("Zoé");
console.log(file[file.length - 1]);
console.log(file[3]);`,
  explain: [
    "On compte : Léa, Tom, Inès, Axel. Il y en a 4.",
    "`file.length` vaut 4, donc on demande la case `[4]`. Les cases vont de 0 à 3 : la case 4 n’existe pas → `undefined`.",
    "4 - 1 = 3 : la case 3 est la dernière. C’est Axel.",
    "Après `push`, il y a 5 éléments : `length - 1` vaut maintenant 4, la case de Zoé. Le même code vise toujours le dernier.",
    "`[3]` écrit à la main vise toujours la case 3, même quand la liste grandit : Axel n’est plus le dernier."
  ],
  debrief: "`[length - 1]` s’adapte à la taille du tableau, `[3]` non. Et `[length]` est toujours une case vide. Retiens le schéma : on compte à partir de 1, on numérote à partir de 0."
}]);

/* =========================== Formation : le chemin des données =========================== */
insertAfter("lumen-mission", [
{
  id: "chemin-observer", ch: 10, type: "observe", title: "Le chemin décomposé", notion: "le chemin vers une donnée",
  bip: "Tu mets des points et des crochets un peu au hasard ? Normal, personne ne t’a montré le chemin. Ici, on le découpe en 4 étapes, une variable par étape. Regarde la Mémoire.",
  diagrams: ["path", "object"],
  where: { text: "Les données d’un vrai site sont rangées comme des poupées russes : une boutique contient des rayons, qui contiennent des produits. Pour afficher un produit, le code suit un chemin à travers ces boîtes. C’est ce que fait un CMS comme Webflow à chaque page.", tags: [["Croissant", "boutique.rayons[1].produits[0]"]] },
  why: "Comprendre le chemin, c’est pouvoir **trouver** n’importe quelle donnée, puis la **modifier** ou la **supprimer**. Sans ça, on écrit des points et des crochets au hasard jusqu’à ce que ça marche.",
  lesson: {
    what: "Un chemin se lit de **gauche à droite**. Chaque morceau s’applique à ce qu’on vient d’obtenir : `.etiquette` si c’est un **objet** `{ }`, `[numéro]` si c’est un **tableau** `[ ]`.",
    code: `boutique                        // l’objet boutique\nboutique.rayons                 // un tableau\nboutique.rayons[1]              // un objet : le 2e rayon\nboutique.rayons[1].produits     // un tableau\nboutique.rayons[1].produits[0]  // "Croissant"`,
    pieces: [[".nom", "on est sur un objet : on ouvre une étiquette"], ["[1]", "on est sur un tableau : on choisit une case"], ["{ } dans les données", "un objet → on continue avec un point"], ["[ ] dans les données", "un tableau → on continue avec des crochets"]],
    trap: "`boutique.rayons.produits` ne marche pas : `rayons` est un tableau, il faut d’abord choisir **quel** rayon avec `[numéro]`."
  },
  code: `const boutique = {
  nom: "Pain d'Or",
  rayons: [
    { nom: "Pains", produits: ["Baguette", "Campagne"] },
    { nom: "Viennoiseries", produits: ["Croissant", "Chausson"] }
  ]
};

const lesRayons = boutique.rayons;
const viennoiseries = lesRayons[1];
const produits = viennoiseries.produits;
const premier = produits[0];
console.log(premier);

console.log(boutique.rayons[1].produits[0]);`,
  notes: {
    1: "Un objet qui contient un tableau, qui contient des objets, qui contiennent un tableau. Tout est rangé dans une seule boîte : `boutique`.",
    9: "**Étape 1** : on ouvre la boutique (un objet) et on prend son étiquette `rayons`. On obtient un **tableau** de 2 rayons. Regarde la Mémoire après cette ligne.",
    10: "**Étape 2** : `lesRayons` est un tableau, donc on choisit une case avec des crochets. `[1]` = le **2e** rayon. On obtient un **objet**.",
    11: "**Étape 3** : `viennoiseries` est un objet, donc on ouvre une étiquette avec un point : `.produits`. On obtient un **tableau** de textes.",
    12: "**Étape 4** : `produits` est un tableau, donc des crochets : `[0]` = le premier, \"Croissant\".",
    15: "La même chose en une ligne : chaque morceau part du résultat du morceau d’avant, de gauche à droite. C’est exactement les 4 étapes, collées."
  },
  questions: [
    { q: "Que contient `lesRayons` après la ligne 9 ?", opts: ["Le texte \"Pains\"", "Un tableau de 2 rayons (2 objets)", "La boutique entière"], a: 1, why: "`.rayons` ouvre l’étiquette rayons, qui contient un tableau." },
    { q: "Pourquoi `[1]` pour les Viennoiseries ?", opts: ["C’est le 2e rayon, et les numéros commencent à 0", "C’est le 1er rayon", "Parce qu’il y a 1 produit"], a: 0, why: "Pains est en [0], Viennoiseries en [1]." },
    { q: "Dans `boutique.rayons[1].produits[0]`, pourquoi des points ET des crochets ?", opts: ["C’est au choix, les deux marchent pareil", "Le point ouvre un objet par son étiquette, le crochet choisit une case d’un tableau par son numéro", "Les crochets sont pour les nombres décimaux"], a: 1, why: "On regarde ce qu’on a obtenu juste avant : objet → point, tableau → crochet." },
    { q: "Les lignes 13 et 15 affichent-elles la même chose ?", opts: ["Oui : la ligne 15 fait les 4 étapes d’un coup", "Non, la ligne 15 affiche undefined", "Non, la ligne 15 affiche tout le tableau"], a: 0, why: "Un long chemin, c’est juste plusieurs petites étapes collées." }
  ],
  debrief: "Un chemin, c’est une suite de petites étapes : chaque point ou crochet descend d’un niveau. Quand tu es perdu dans un long chemin, découpe-le en variables intermédiaires, comme ici, et regarde la Mémoire."
},
{
  id: "chemin-recuperer", ch: 10, type: "path", title: "Récupérer une donnée", notion: "lire avec un chemin",
  bip: "À toi de tracer le chemin ! Le jeu t’affiche les données de la boutique sous forme de boîtes. Trouve le chemin vers chaque boîte verte.",
  diagrams: ["path"],
  where: { text: "Afficher le prix d’un produit, le nom d’un rayon, le nombre d’articles : sur un site, chaque information affichée a été **récupérée** avec un chemin.", tags: [["1,20 €", "boutique.rayons[1].produits[0].prix"]] },
  why: "Récupérer est la base de tout : pour modifier ou supprimer une donnée, il faut d’abord savoir l’atteindre.",
  steps: PATH_STEPS,
  root: "boutique", data: BOUTIQUE,
  tasks: [
    { mode: "get", q: "Récupère le **nom** de la boutique.", target: ["nom"], explain: "`boutique` est un objet : on ouvre son étiquette `nom`. Une seule étape." },
    { mode: "get", q: "Récupère le **tableau** de tous les rayons.", target: ["rayons"], explain: "`.rayons` donne le tableau entier, avec ses 2 rayons." },
    { mode: "get", q: "Récupère le **premier rayon** (tout l’objet).", target: ["rayons", 0], explain: "`rayons` est un tableau : on choisit une case avec `[0]`, le premier." },
    { mode: "get", q: "Récupère le **nom du deuxième rayon**.", target: ["rayons", 1, "nom"], explain: "Tableau → `[1]` (2e case) → c’est un objet → `.nom`." },
    { mode: "get", q: "Récupère le **prix du croissant**.", target: ["rayons", 1, "produits", 0, "prix"], explain: "5 étapes : `.rayons` (tableau) → `[1]` (objet) → `.produits` (tableau) → `[0]` (objet) → `.prix`." },
    { mode: "get", q: "Combien de produits dans le rayon Viennoiseries ? Récupère sa **length**.", target: ["rayons", 1, "produits", "length"], explain: "`length` s’utilise sur un tableau : on va jusqu’au tableau `produits`, puis `.length`." },
    { mode: "get", q: "Récupère le **dernier produit** des Viennoiseries, sans écrire son numéro à la main.", target: ["rayons", 1, "produits", 2], requireLength: true, explain: "Entre les crochets, on peut mettre un calcul : `[tableau.length - 1]`. Si on ajoute un produit, ce chemin vise toujours le dernier." }
  ],
  debrief: "Tu as tracé 7 chemins. La règle ne change jamais : regarde ce que tu viens d’obtenir. Un objet `{ }` → `.etiquette`. Un tableau `[ ]` → `[numéro]`."
},
{
  id: "chemin-modifier", ch: 10, type: "path", title: "Modifier et ajouter", notion: "chemin + = / push",
  bip: "La boulangère veut mettre à jour son site. Pour **modifier** une donnée, c’est le même chemin que pour la lire, plus un `=`. Pour **ajouter** dans un tableau : `.push(…)`.",
  diagrams: ["crud"],
  where: { text: "Le back-office d’un site (Webflow, Shopify, WordPress) : chaque bouton « Modifier » ou « Ajouter » fait exactement ça dans les données, avant de redessiner la page.", tags: [["Modifier le prix", "…prix = 1.2"], ["+ Ajouter un produit", "…produits.push({ … })"]] },
  why: "On ne modifie jamais « la donnée » toute seule : on suit le chemin jusqu’à elle, puis on agit. Si le chemin est faux, on modifie la mauvaise chose (ou rien).",
  lesson: {
    what: "Modifier = **le chemin** + `=` + la nouvelle valeur. Si l’étiquette n’existait pas, elle est créée. Ajouter dans un tableau = le chemin du tableau + `.push(valeur)`.",
    code: `boutique.ville = "Cimiez";                  // modifier\nboutique.telephone = "04 93 00 00 00";      // créer une étiquette\nboutique.rayons[0].produits.push({ nom: "Brioche", prix: 2 });`,
    pieces: [["chemin = valeur", "remplace la valeur au bout du chemin"], ["objet.nouvelle = …", "crée une étiquette qui n’existait pas"], ["tableau.push(…)", "ajoute à la fin du tableau"], ["{ nom: …, prix: … }", "on peut ajouter un objet entier"]],
    trap: "`push` s’utilise sur un **tableau** (`produits`), pas sur un objet (`boutique.rayons[0]`)."
  },
  steps: PATH_STEPS.concat(["Pour modifier : écris le chemin puis `= nouvelle valeur`. Pour ajouter : `chemin_du_tableau.push(valeur)`."]),
  root: "boutique", data: BOUTIQUE,
  tasks: [
    { mode: "set", q: "Le prix de la **baguette** passe à **1.2**.", target: ["rayons", 0, "produits", 0, "prix"], value: 1.2, explain: "Même chemin que pour lire le prix, plus `= 1.2`. La boîte verte a changé." },
    { mode: "set", q: "La boutique déménage : la **ville** devient \"Cimiez\".", target: ["ville"], value: "Cimiez", explain: "Un texte, donc entre guillemets." },
    { mode: "set", q: "Le rayon **Pains** s’appelle désormais \"Pains spéciaux\".", target: ["rayons", 0, "nom"], value: "Pains spéciaux", explain: "Chemin vers le nom du premier rayon, puis `=`." },
    { mode: "push", q: "Ajoute le produit `{ nom: \"Brioche\", prix: 2 }` à la fin du rayon **Viennoiseries**.", target: ["rayons", 1, "produits"], value: { nom: "Brioche", prix: 2 }, explain: "`push` s’applique au **tableau** `produits`. Regarde : length est passé de 3 à 4." },
    { mode: "set", q: "Ajoute à la boutique une nouvelle étiquette **telephone** qui vaut \"04 93 00 00 00\".", target: ["telephone"], value: "04 93 00 00 00", explain: "Écrire dans une étiquette qui n’existe pas la **crée**." }
  ],
  debrief: "Lire, modifier, ajouter : c’est toujours le même chemin, seule la fin change (`=`, `.push`). Tu viens de faire ce que fait un back-office."
},
{
  id: "chemin-supprimer", ch: 10, type: "path", title: "Supprimer", notion: "splice et delete",
  bip: "Dernière étape du chemin : supprimer. Dans un tableau, on enlève une case avec `splice`. Dans un objet, on enlève une étiquette avec `delete`.",
  diagrams: ["crud", "array"],
  where: { text: "Le bouton « Supprimer » d’un panier, d’une liste de tâches ou d’un back-office : il retire un élément des données, puis la page est redessinée.", tags: [["Supprimer", "produits.splice(2, 1)"]] },
  why: "Supprimer demande de viser **juste** : un mauvais numéro, et c’est un autre produit qui disparaît. C’est là que `length - 1` et les index commencent à vraiment compter.",
  lesson: {
    what: "`tableau.splice(index, 1)` enlève **1** élément à la position `index`, et les suivants remontent d’une case. `delete objet.etiquette` enlève une étiquette d’un objet.",
    code: `produits.splice(2, 1);        // enlève la case 2\nproduits.splice(produits.length - 1, 1);  // enlève la dernière\ndelete boutique.ville;        // enlève l’étiquette ville`,
    pieces: [["splice(", "« découpe » le tableau"], ["2,", "à partir de quelle case (l’index)"], ["1)", "combien d’éléments enlever"], ["delete", "pour une étiquette d’objet"]],
    trap: "Après un `splice`, les éléments suivants **changent de numéro** : celui qui était en [3] passe en [2]."
  },
  steps: PATH_STEPS.concat(["Pour supprimer dans un tableau : `chemin_du_tableau.splice(index, 1)`. Dans un objet : `delete chemin`. La case à supprimer est encadrée en rouge."]),
  root: "boutique", data: BOUTIQUE,
  tasks: [
    { mode: "splice", q: "Le **Chausson** n’est plus vendu : supprime-le du rayon Viennoiseries avec `splice`.", target: ["rayons", 1, "produits"], index: 2, explain: "Le Chausson était en case [2] : `splice(2, 1)` enlève 1 élément à cette position. length est passé de 3 à 2." },
    { mode: "delete", q: "Supprime l’étiquette **ville** de la boutique avec `delete`.", target: ["ville"], explain: "`delete` retire l’étiquette entière (le nom et la valeur)." },
    { mode: "splice", q: "Supprime le **dernier** produit du rayon Pains, sans écrire son numéro à la main.", target: ["rayons", 0, "produits"], index: "last", requireLength: true, explain: "`splice(tableau.length - 1, 1)` enlève toujours le dernier, quelle que soit la taille." },
    { mode: "splice", q: "Supprime **tout le premier rayon**.", target: ["rayons"], index: 0, explain: "On peut supprimer un objet entier d’un tableau. Le rayon Viennoiseries est remonté en case [0] !" }
  ],
  debrief: "Supprimer, c’est encore un chemin, avec `splice` ou `delete` au bout. Et tu as vu le piège : après une suppression, les numéros des cases suivantes changent."
}
]);

/* =========================== Formation : les accolades =========================== */
insertAfter("lou-mission", [
{
  id: "accolades-observer", ch: 11, type: "observe", title: "Les boîtes dans les boîtes", notion: "lire les accolades",
  bip: "Tu mets des accolades un peu partout pour que l’erreur disparaisse ? On va apprendre à les **lire**. Chaque `{` ouvre une boîte, sa `}` la ferme. Suis le pas à pas : regarde dans quelle boîte on se trouve.",
  diagrams: ["blocks"],
  where: { text: "Tout vrai code est fait de boîtes emboîtées : une fonction qui contient une boucle qui contient une condition. Savoir où commence et où finit chaque boîte, c’est savoir quand chaque ligne s’exécute.", tags: [["la boucle", "liste.forEach((note) => { … });"], ["la condition", "if (note >= 10) { … }"]] },
  why: "Une ligne ne s’exécute que si toutes les boîtes qui l’entourent s’ouvrent, et autant de fois que la boucle qui l’entoure tourne. Placer une ligne une accolade plus haut ou plus bas change complètement le résultat.",
  lesson: {
    what: "Pour savoir à quelle boîte appartient une ligne : remonte jusqu’à la première `{` encore ouverte au-dessus d’elle. Le **décalage** (2 espaces par boîte) le montre à l’œil : plus une ligne est décalée, plus elle est profonde.",
    code: `function compter(liste) {        // boîte 1\n  liste.forEach((note) => {      // boîte 2\n    if (note >= 10) {            // boîte 3\n      reussies = reussies + 1;\n    }                            // ferme 3\n  });                            // ferme 2\n}                                // ferme 1`,
    pieces: [["{", "ouvre une boîte"], ["}", "ferme la dernière boîte ouverte"], ["});", "`}` ferme la fonction fléchée, `)` ferme l’appel `forEach(`, `;` termine l’instruction"], ["décalage", "2 espaces de plus à chaque boîte"]],
    trap: "Ajouter une `}` pour faire taire une erreur, c’est souvent fermer la mauvaise boîte. Cherche d’abord quelle `{` n’a pas de partenaire."
  },
  code: `const notes = [14, 8, 17];
let reussies = 0;

function compter(liste) {
  liste.forEach((note) => {
    if (note >= 10) {
      reussies = reussies + 1;
    }
  });
  console.log(reussies + " notes réussies");
}

compter(notes);`,
  notes: {
    4: "La fonction est rangée. Sa boîte va de la `{` de la ligne 4 à la `}` de la ligne 11. Rien ne s’exécute avant l’appel de la ligne 13.",
    5: "On entre dans la boîte de la fonction. Ici s’ouvre la boîte 2 : celle de la boucle, jusqu’à `});` ligne 9.",
    7: "On est dans **3 boîtes** : la fonction, la boucle, le if. Cette ligne ne tourne que si `note >= 10`, et seulement pendant la boucle.",
    10: "On est **sorti** de la boucle (après `});`) mais toujours **dans** la fonction. Cette ligne s’exécute une seule fois.",
    13: "L’appel : JavaScript saute dans la boîte de la fonction."
  },
  questions: [
    { q: "La `}` de la ligne 8 ferme quelle boîte ?", opts: ["La boîte du if (ligne 6)", "La boîte du forEach (ligne 5)", "La boîte de la fonction (ligne 4)"], a: 0, why: "La dernière boîte encore ouverte avant la ligne 8, c’est celle du if." },
    { q: "Combien de fois la ligne 7 est-elle exécutée ?", opts: ["3 fois", "2 fois", "1 fois"], a: 1, why: "Elle est dans la boucle (3 tours) ET dans le if (seulement 14 et 17 passent) : 2 fois." },
    { q: "Si on déplaçait la ligne 10 juste avant la ligne 8, que se passerait-il ?", opts: ["Rien ne changerait", "Le message s’afficherait à chaque note réussie (2 fois), car il serait dans le if et dans la boucle", "Le code planterait"], a: 1, why: "Même ligne, autre boîte : elle s’exécuterait autant de fois que la boîte s’ouvre." },
    { q: "Pourquoi la ligne 9 s’écrit `});` et pas juste `}` ?", opts: ["Par habitude", "`}` ferme la fonction fléchée, `)` ferme la parenthèse ouverte par `forEach(`", "C’est une erreur"], a: 1, why: "Ligne 5, on a ouvert une parenthèse `forEach(` puis une accolade `{`. On les ferme dans l’ordre inverse : `}` puis `)`." }
  ],
  debrief: "Tu sais maintenant lire une structure : chaque ligne appartient à la boîte ouverte la plus proche au-dessus d’elle. Quand tu écris une `{`, écris tout de suite sa `}`, puis remplis entre les deux."
},
{
  id: "accolades-objet", ch: 11, type: "observe", title: "Objet ou bloc ?", notion: "deux sortes d’accolades",
  bip: "Piège : les accolades servent à **deux** choses différentes. Parfois elles ouvrent une boîte de code, parfois elles créent un objet. Apprends à les distinguer.",
  diagrams: ["blocks", "object"],
  where: { text: "Dans un vrai fichier JavaScript, les deux se mélangent tout le temps : des objets (les données) et des blocs (les instructions). Un site de portfolio ou une boutique en est plein.", tags: [["{ titre: …, annee: … }", "objet : des données"], ["if (…) { … }", "bloc : des instructions"]] },
  why: "Si tu confonds les deux, tu écris des `;` dans un objet ou des `nom: valeur` dans un if, et rien ne marche. Reconnaître le rôle d’une accolade, c’est savoir ce qu’on a le droit d’écrire dedans.",
  lesson: {
    what: "Une accolade est un **objet** quand elle vient après `=`, dans `[ ]` ou dans `( )`, et qu’elle contient des étiquettes `nom: valeur` séparées par des virgules. C’est un **bloc** quand elle vient après `if (…)`, `else`, `function nom(…)` ou `=>`, et qu’elle contient des instructions.",
    code: `const fiche = { nom: "Bip", age: 3 };   // objet : étiquettes + virgules\nif (fiche.age > 2) {                   // bloc : instructions + ;\n  console.log("Grand");\n}`,
    pieces: [["= { … }", "objet"], ["[{ … }, { … }]", "des objets rangés dans un tableau"], ["if (…) { … }", "bloc de code"], ["=> { … }", "bloc de code (le corps de la fonction)"]],
    trap: "Dans un objet : des **virgules** entre les étiquettes. Dans un bloc : des **points-virgules** à la fin des instructions."
  },
  code: `const meteo = { ville: "Nice", temperature: 8 };

function conseil(m) {
  if (m.temperature < 10) {
    return "Manteau";
  }
  return "Pull";
}

const villes = [{ nom: "Nice" }, { nom: "Gap" }];
villes.forEach((v) => {
  console.log(v.nom + " : " + conseil(meteo));
});`,
  notes: {
    1: "Cette accolade vient après `=` et contient `ville: \"Nice\", temperature: 8` : c’est un **objet**. Regarde la Mémoire : une fiche avec 2 étiquettes.",
    3: "Ici, l’accolade vient après `function conseil(m)` : c’est un **bloc**, le corps de la fonction. Elle contient des instructions.",
    4: "Après `if (…)` : encore un **bloc**.",
    10: "Des accolades **dans** des crochets : ce sont des **objets** rangés dans un tableau.",
    11: "Après `=>` : un **bloc**, le corps de la fonction fléchée, répété à chaque tour."
  },
  questions: [
    { q: "L’accolade de la ligne 1 crée…", opts: ["un bloc de code", "un objet (une fiche avec des étiquettes)", "une fonction"], a: 1, why: "Après `=`, avec des `nom: valeur` séparés par des virgules : un objet." },
    { q: "L’accolade de la ligne 3 ouvre…", opts: ["le corps de la fonction (un bloc)", "un objet", "un tableau"], a: 0, why: "Après `function conseil(m)` : un bloc d’instructions." },
    { q: "À la ligne 10, que sont les `{ }` dans les `[ ]` ?", opts: ["Des blocs if", "Des objets, rangés dans un tableau", "Des erreurs"], a: 1, why: "Un tableau d’objets, comme les produits d’une boutique ou les projets d’un portfolio." },
    { q: "Comment reconnaître une accolade d’objet ?", opts: ["Elle est toujours au début d’une ligne", "Elle contient des étiquettes `nom: valeur` séparées par des virgules", "Elle est suivie de return"], a: 1, why: "Objet = données (étiquettes et virgules). Bloc = instructions (points-virgules)." }
  ],
  debrief: "Deux sortes d’accolades : les **objets** rangent des données, les **blocs** rangent des instructions. Regarde ce qui est juste avant (`=` ou `if (…)`) et ce qu’il y a dedans (virgules ou points-virgules)."
},
{
  id: "accolades-reparer", ch: 11, type: "fix", title: "Le total qui s’affiche trois fois", notion: "une ligne dans la mauvaise boîte",
  bip: "Le restaurant Chez Lou a un nouveau bug : le total du panier s’affiche trois fois, avec des valeurs différentes, et la fonction renvoie undefined. Tout est une question de boîtes.",
  diagrams: ["blocks", "foreach"],
  where: { text: "Un récap de commande qui affiche trois totaux, ou une fonction qui renvoie undefined alors qu’elle « calcule bien » : ce sont deux bugs d’accolades très courants.", tags: [["Total : 10 €, 30 €, 35 €", "console.log dans la boucle"], ["undefined", "return dans la boucle"]] },
  why: "Le code peut être juste ligne par ligne, et faux dans sa structure. Le pas à pas montre **combien de fois** chaque ligne tourne : c’est le meilleur détecteur de ligne mal placée.",
  steps: ["Lance et lis la console : trois totaux.", "Lance le **pas à pas** : combien de fois passe-t-on par la ligne 5 ?", "Range chaque ligne dans la bonne boîte : le calcul dans la boucle, le `return` après la boucle, l’affichage une seule fois."],
  starter: `function totalPanier(prix) {
  let total = 0;
  prix.forEach((p) => {
    total = total + p;
    console.log("Total : " + total + " €");
    return total;
  });
}

const t = totalPanier([10, 20, 5]);
`,
  goals: [
    { label: "La console affiche `Total : 35 €`, une seule fois", test: c => { const ts = logTexts(c.main).filter(t => t.startsWith("Total")); if (ts.length === 1 && ts[0] === "Total : 35 €") return true; if (ts.length > 1) return "Le total s’affiche " + ts.length + " fois : le `console.log` est dans la boîte de la boucle."; return ts.length === 1 ? "Le total affiché est « " + ts[0] + " »." : false; } },
    { label: "`totalPanier([10, 20, 5])` renvoie 35", test: c => { const f = V(c.runs[0], "totalPanier"); if (typeof f !== "function") return false; silent = true; const r = f([10, 20, 5]); silent = false; return r === 35 || (r === undefined ? "La fonction renvoie undefined : le `return` est dans la petite fonction de la boucle, pas dans `totalPanier`." : false); } },
    { label: "Ça marche avec un autre panier", test: c => { const f = V(c.runs[0], "totalPanier"); if (typeof f !== "function") return false; return f([1, 2]) === 3; } }
  ],
  hints: ["Le pas à pas montre que la ligne 5 tourne 3 fois : elle est **entre** les accolades du forEach.", "Le `return total;` doit être **après** `});`, mais toujours **dans** la fonction `totalPanier`.", "Pour l’affichage : après l’appel, en bas du fichier, `console.log(\"Total : \" + t + \" €\");`"],
  solution: `function totalPanier(prix) {
  let total = 0;
  prix.forEach((p) => {
    total = total + p;
  });
  return total;
}

const t = totalPanier([10, 20, 5]);
console.log("Total : " + t + " €");`,
  check: [
    { q: "Pourquoi le message s’affichait 3 fois ?", opts: ["Il était dans les accolades du forEach, donc répété à chaque tour", "Parce que console.log affiche toujours 3 fois", "Parce qu’il y a 3 variables"], a: 0, why: "Tout ce qui est entre les accolades de la boucle se répète." },
    { q: "Pourquoi `return total;` dans le forEach donnait undefined ?", opts: ["Il renvoyait depuis la petite fonction fléchée (un tour de boucle), pas depuis totalPanier", "return ne marche pas avec les nombres", "Parce que total valait 0"], a: 0, why: "Un `return` sort de la fonction **la plus proche** qui l’entoure : ici `(p) => { … }`." }
  ],
  debrief: "Même code, autres boîtes, autre résultat. Pour chaque ligne, demande-toi : « combien de fois doit-elle tourner ? » La réponse te dit dans quelle boîte la mettre."
}
]);

/* =========================== Panier Malin : supprimer =========================== */
insertAfter("malin-completer", [
{
  id: "malin-supprimer", ch: 9, type: "observe", title: "Supprimer un élément", notion: "splice, filter, remove",
  bip: "Une appli de courses doit pouvoir **retirer** un article. Il y a trois façons de supprimer selon ce qu’on vise : une case de tableau, plusieurs éléments par condition, ou un élément de la page.",
  stage: `<ul class="liste">\n  <li>Pain</li>\n  <li>Lait</li>\n  <li>Pommes</li>\n</ul>`,
  diagrams: ["crud", "filter"],
  where: { text: "Le ✕ à côté d’un article, le bouton « Vider le panier », « Supprimer ce commentaire » : les données sont modifiées, et l’élément disparaît de la page.", tags: [["✕ Lait", "courses.splice(i, 1)"], ["Retirer tout le riz", "courses.filter(…)"], ["l’élément disparaît", "li.remove()"]] },
  why: "Supprimer, c’est d’abord **trouver** (l’index, la condition, l’élément), puis enlever. Chaque outil a son usage : `splice` change le tableau lui-même, `filter` en crée un nouveau, `remove` enlève de la page.",
  lesson: {
    what: "`indexOf` trouve le numéro d’un élément. `splice(index, 1)` enlève cette case du tableau. `filter` crée un nouveau tableau sans les éléments qui ne passent pas le test. `element.remove()` enlève un élément de la page.",
    code: `const i = courses.indexOf("Lait");   // 1\ncourses.splice(i, 1);                 // enlève la case 1\nconst sansRiz = courses.filter((a) => a !== "Riz");\nli.remove();                          // enlève de la page`,
    pieces: [["indexOf(x)", "le numéro de la case qui contient x (ou -1 si absent)"], ["splice(i, 1)", "modifie le tableau lui-même"], ["filter(…)", "nouveau tableau ; l’original ne change pas"], ["el.remove()", "l’élément quitte la page"]],
    trap: "Supprimer dans le tableau ne supprime **pas** dans la page (et inversement) : il faut redessiner la page, ou faire les deux."
  },
  code: `const courses = ["Pain", "Lait", "Pommes", "Riz"];

const i = courses.indexOf("Lait");
courses.splice(i, 1);
console.log(courses);

const sansRiz = courses.filter((article) => article !== "Riz");
console.log(sansRiz);
console.log(courses);

const premier = document.querySelector(".liste li");
premier.remove();`,
  notes: {
    3: "`indexOf` cherche \"Lait\" et renvoie son numéro de case : 1.",
    4: "`splice(1, 1)` : à la case 1, on enlève 1 élément. Regarde la Mémoire : Pommes remonte en case 1, Riz en case 2.",
    7: "`filter` garde tout ce qui est **différent** (`!==`) de \"Riz\". C’est la façon la plus courante de « supprimer » par condition.",
    9: "`courses` contient **toujours** Riz : filter n’a pas touché l’original, il a créé `sansRiz`.",
    11: "Dans la page : on attrape le premier `li` de la liste…",
    12: "…et `remove()` le retire. Regarde l’aperçu de la page à l’étape suivante."
  },
  questions: [
    { q: "Que fait `courses.splice(i, 1)` ?", opts: ["Il enlève 1 élément à la position i, dans le tableau lui-même", "Il crée un nouveau tableau sans Lait", "Il vide le tableau"], a: 0, why: "splice modifie directement `courses`." },
    { q: "Après la ligne 7, `courses` contient-il encore Riz ?", opts: ["Non, filter l’a supprimé", "Oui : filter crée un nouveau tableau, l’original ne change pas", "Il contient seulement Riz"], a: 1, why: "C’est pour ça qu’on range le résultat : `const sansRiz = …` (ou `courses = courses.filter(…)` avec un `let`)." },
    { q: "Après `premier.remove()`, le tableau `courses` a-t-il changé ?", opts: ["Oui, Pain est supprimé du tableau", "Non : remove() agit sur la page, pas sur le tableau", "Le tableau est vidé"], a: 1, why: "Page et données sont deux choses séparées. Une appli doit garder les deux synchronisées." }
  ],
  debrief: "Trois outils de suppression : `splice` (une case du tableau), `filter` (par condition, nouveau tableau), `remove` (un élément de la page). La mission suivante les combine."
},
{
  id: "malin-bouton", ch: 9, type: "fill", title: "Le bouton ✕", notion: "supprimer puis redessiner",
  bip: "Chaque article de la liste a maintenant un bouton ✕. Au clic, l’article doit disparaître des **données** et de la **page**. Complète les cases.",
  stage: `<ul class="liste"></ul>`,
  diagrams: ["render", "filter"],
  where: { text: "Le ✕ d’une liste de courses, d’un panier ou d’une liste de tâches : on enlève l’élément du tableau, puis on redessine.", tags: [["✕", "courses = courses.filter(…)"], ["la liste à jour", "afficher()"]] },
  why: "Si on supprime seulement dans la page, les données mentent (le total reste faux). Si on supprime seulement dans le tableau, la page ment. Le duo « changer les données, puis afficher() » garde tout synchronisé.",
  steps: ["Complète les cases vides.", "Lance, puis clique sur les ✕ dans l’onglet **Page**.", "Réponds aux questions pour valider."],
  template: `const ul = document.querySelector(".liste");
let courses = ["Pain", "Lait", "Pommes"];

function afficher() {
  ul.innerHTML = "";
  courses.forEach((article) => {
    const li = document.createElement("li");
    li.textContent = article + " ";
    const bouton = document.createElement("button");
    bouton.textContent = "✕";
    bouton.addEventListener("click", () => {
      courses = courses.{{filter}}((a) => a {{!==}} article);
      {{afficher()}};
    });
    li.appendChild(bouton);
    ul.appendChild(li);
  });
}

afficher();`,
  goals: [
    { label: "Au départ, la liste affiche 3 articles", test: c => c.runs[0].stage.querySelectorAll(".liste li").length === 3 },
    { label: "Clic sur le ✕ de Lait : il reste Pain et Pommes", test: c => { const r = freshRun(c); const lis = [...r.stage.querySelectorAll(".liste li")]; const lait = lis.find(li => li.firstChild && li.firstChild.textContent.trim() === "Lait"); if (!lait) return false; lait.querySelector("button").click(); const names = [...r.stage.querySelectorAll(".liste li")].map(li => li.firstChild.textContent.trim()); if (names.length === 3) return "Rien n’a disparu : as-tu rappelé `afficher()` après avoir changé le tableau ?"; return JSON.stringify(names) === JSON.stringify(["Pain", "Pommes"]) || (names.length === 1 ? "Il ne reste que " + names[0] + " : le test du filter garde l’inverse de ce qu’il faut. Garde ceux qui sont **différents** de l’article cliqué." : false); } },
    { label: "Deux suppressions de suite marchent", test: c => { const r = freshRun(c); const click = name => { const li = [...r.stage.querySelectorAll(".liste li")].find(x => x.firstChild.textContent.trim() === name); if (li) li.querySelector("button").click(); }; click("Pain"); click("Pommes"); const names = [...r.stage.querySelectorAll(".liste li")].map(li => li.firstChild.textContent.trim()); return JSON.stringify(names) === JSON.stringify(["Lait"]); } }
  ],
  hints: ["Case 1 : la méthode qui crée un nouveau tableau avec seulement les éléments qui passent un test.", "Case 2 : on garde les articles **différents** de celui qu’on a cliqué.", "Case 3 : le tableau a changé, il faut redessiner la page."],
  check: [
    { q: "Pourquoi `let courses` et pas `const` ?", opts: ["filter crée un nouveau tableau qu’on range à la place de l’ancien : on réassigne la variable", "Parce que les tableaux sont toujours en let", "C’est pareil"], a: 0, why: "`courses = courses.filter(…)` remplace le contenu de la boîte : il faut `let`." },
    { q: "Pourquoi rappeler `afficher()` après la suppression ?", opts: ["Le tableau a changé ; la page doit être redessinée pour suivre les données", "Pour supprimer le bouton", "Ce n’est pas utile"], a: 0, why: "Données d’abord, affichage ensuite. Toujours." }
  ],
  debrief: "Supprimer dans une appli = changer les données, puis redessiner. C’est la même règle pour ajouter et modifier : tu as maintenant les quatre opérations."
}
]);
