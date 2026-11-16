"use strict";
/* =====================================================================
   PROJET FIL ROUGE : 3 types de projets, 7 étapes chacun
   Les solutions sont étiquetées par étape : une section « // ===== Étape N »
   ou une fin de ligne « //@N » (JS), « <!--@N--> » (HTML).
   ===================================================================== */

const PROJECT_CSS = `/* ===== 1. Tes réglages : change les couleurs et les polices ===== */
.app {
  --fond: #FFF8F0;
  --texte: #2B2118;
  --accent: #E4572E;
  --carte: #FFFFFF;
  --doux: #8A7F75;
  --rayon: 16px;
  --police-titre: "Bricolage Grotesque", Georgia, serif;
  --police-texte: "Atkinson Hyperlegible", Arial, sans-serif;
}

/* ===== 2. La page, mobile d'abord ===== */
* { box-sizing: border-box; }
body { margin: 0; }
.app {
  container-type: inline-size;
  min-height: 100vh;
  padding: 24px 16px;
  display: grid;
  gap: 20px;
  align-content: start;
  background: var(--fond);
  color: var(--texte);
  font-family: var(--police-texte);
  transition: background .3s, color .3s;
}
.entete { display: grid; gap: 8px; }
.titre { font-family: var(--police-titre); font-size: 2.2rem; line-height: 1; margin: 0; }
.slogan { color: var(--doux); margin: 0; }
.theme { justify-self: start; }
.filtres { display: flex; flex-wrap: wrap; gap: 8px; }
.filtre { border: 2px solid var(--texte); background: transparent; color: var(--texte); border-radius: 999px; padding: 6px 14px; font: inherit; cursor: pointer; }
.filtre:hover { background: var(--texte); color: var(--fond); }
.grille { display: grid; gap: 14px; }
.carte { background: var(--carte); border-radius: var(--rayon); padding: 16px; display: grid; gap: 6px; box-shadow: 0 2px 0 rgba(0, 0, 0, .08); }
.carte h2 { font-family: var(--police-titre); margin: 0; font-size: 1.25rem; }
.carte p { margin: 0; color: var(--doux); }
.carte button, .theme, form button { justify-self: start; border: 0; border-radius: 999px; padding: 7px 14px; background: var(--accent); color: #fff; font: inherit; cursor: pointer; }
.carte .supprimer, .retirer { background: transparent; color: var(--doux); border: 1px solid currentColor; }

/* États ajoutés par JavaScript */
.carte.aime { outline: 3px solid var(--accent); }
.carte.fait { opacity: .6; }
.carte.fait h2 { text-decoration: line-through; }
.app.sombre { --fond: #1D1A17; --texte: #F5EFE8; --carte: #2A2622; --doux: #B8ADA2; }

/* Formulaires */
form { display: grid; gap: 8px; background: var(--carte); border-radius: var(--rayon); padding: 16px; }
form h2, .panier-bloc h2 { font-family: var(--police-titre); margin: 0; }
input, textarea { font: inherit; padding: 8px 10px; border: 2px solid #D9D2CA; border-radius: 10px; }
.erreur { color: #C0392B; font-weight: 700; margin: 0; }
.succes { color: #1E8449; font-weight: 700; margin: 0; }
.nb-favoris, .progression { color: var(--accent); font-weight: 700; margin: 0; }

/* Panier (boutique) */
.panier-bloc { background: var(--carte); border-radius: var(--rayon); padding: 16px; display: grid; gap: 10px; }
.panier { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.total { font-weight: 700; margin: 0; }

/* ===== 3. Version ordinateur : quand la page fait plus de 700 px ===== */
@container (min-width: 700px) {
  .entete { grid-template-columns: 1fr auto; align-items: end; }
  .titre { font-size: 3.4rem; }
  .grille { grid-template-columns: repeat(3, 1fr); }
}
`;

/* ---------- les 3 projets ---------- */
const PROJECT_TYPES = {
  site: {
    label: "Le site vitrine", short: "Présenter des réalisations",
    pitch: "Le portfolio d’un créatif, la vitrine d’un artisan, la page d’un groupe de musique ou d’une association. Une galerie filtrable, des favoris et un formulaire de contact.",
    ideas: ["ton propre portfolio", "un tatoueur ou un photographe", "un groupe de musique", "une association"],
    features: ["une galerie de réalisations en cartes", "des filtres par catégorie", "un bouton J’aime et un compteur de favoris", "un mode sombre", "un formulaire de contact vérifié"],
    data: "projets", titleKey: "titre",
    fields: [["titre", "string", "le nom de la réalisation"], ["categorie", "string", "pour les filtres"], ["annee", "number", "un nombre, sans guillemets"], ["description", "string", "une courte phrase"]],
    example: `{ titre: "Festival Lueurs", categorie: "Affiches", annee: 2026, description: "Affiche du festival" }`,
    mock: `<div class="mk"><div class="mk-bar"><span>atelier-lune.fr</span></div><div class="mk-body mk-col"><p class="mk-h">Atelier Lune</p><div class="mk-chips"><span class="on">Tout</span><span>Affiches</span><span>Logos</span></div><div class="mk-grid"><div class="mk-tile t1"><b>Lueurs</b><small>♥</small></div><div class="mk-tile t2"><b>Collines</b></div><div class="mk-tile t3"><b>Robinet</b><small>♥</small></div></div><span class="mk-btn">Me contacter</span></div></div>`,
    html: `<div class="app">
  <header class="entete">
    <div>
      <h1 class="titre">Mon projet</h1>
      <p class="slogan">Mon slogan</p>
      <p class="nb-favoris">♥ Favoris : 0</p><!--@6-->
    </div>
    <button class="theme">Mode sombre</button>
  </header>

  <nav class="filtres">
    <button class="filtre">Tout</button><!--@5-->
    <button class="filtre">Affiches</button><!--@5-->
    <button class="filtre">Logos</button><!--@5-->
    <button class="filtre">Web</button><!--@5-->
  </nav>

  <main class="grille"></main>

  <footer class="pied">
    <form class="contact"><!--@7-->
      <h2>Me contacter</h2><!--@7-->
      <label for="nom">Nom</label><!--@7-->
      <input id="nom" type="text"><!--@7-->
      <label for="email">E-mail</label><!--@7-->
      <input id="email" type="text"><!--@7-->
      <label for="message">Message</label><!--@7-->
      <textarea id="message" rows="3"></textarea><!--@7-->
      <button type="submit">Envoyer</button><!--@7-->
      <p class="erreur"></p><!--@7-->
      <p class="succes"></p><!--@7-->
    </form><!--@7-->
  </footer>
</div>`,
    js: `// ===== Étape 1 : les données =====
const nomProjet = "Atelier Lune";
const slogan = "Graphisme et illustration à Nice";
const projets = [
  { titre: "Festival Lueurs", categorie: "Affiches", annee: 2026, description: "Affiche du festival de lumière" },
  { titre: "Ferme des Collines", categorie: "Logos", annee: 2025, description: "Identité d'une ferme bio" },
  { titre: "Allô Robinet", categorie: "Web", annee: 2026, description: "Site d'un plombier niçois" },
  { titre: "Nuit du jazz", categorie: "Affiches", annee: 2024, description: "Affiche de concert" }
];
console.log(projets.length + " projets");
console.log(projets[projets.length - 1].titre);

// ===== Étape 2 : une fonction utile =====
function compterCategorie(categorie) {
  return projets.filter((projet) => projet.categorie === categorie).length;
}
console.log(compterCategorie("Affiches") + " affiches");

// ===== Étape 3 : l'en-tête et le mode sombre =====
const app = document.querySelector(".app");
const boutonTheme = document.querySelector(".theme");
document.querySelector(".titre").textContent = nomProjet;
document.querySelector(".slogan").textContent = slogan;

boutonTheme.addEventListener("click", () => {
  app.classList.toggle("sombre");
  if (app.classList.contains("sombre")) {
    boutonTheme.textContent = "Mode clair";
  } else {
    boutonTheme.textContent = "Mode sombre";
  }
});

// ===== Étape 4 : l'affichage des cartes =====
const grille = document.querySelector(".grille");

function afficher(liste) {
  grille.innerHTML = "";
  liste.forEach((projet) => {
    const carte = document.createElement("article");
    carte.classList.add("carte");

    const titre = document.createElement("h2");
    titre.textContent = projet.titre;
    const infos = document.createElement("p");
    infos.textContent = projet.categorie + " · " + projet.annee;
    const texte = document.createElement("p");
    texte.textContent = projet.description;
    carte.appendChild(titre);
    carte.appendChild(infos);
    carte.appendChild(texte);

    const favori = document.createElement("button"); //@6
    favori.classList.add("favori"); //@6
    favori.textContent = "♥ J'aime"; //@6
    favori.addEventListener("click", () => { //@6
      carte.classList.toggle("aime"); //@6
      compterFavoris(); //@6
    }); //@6
    carte.appendChild(favori); //@6

    grille.appendChild(carte);
  });
}

afficher(projets);

// ===== Étape 5 : les filtres =====
document.querySelectorAll(".filtre").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const choix = bouton.textContent;
    if (choix === "Tout") {
      afficher(projets);
    } else {
      afficher(projets.filter((projet) => projet.categorie === choix));
    }
  });
});

// ===== Étape 6 : les favoris =====
function compterFavoris() {
  const nb = document.querySelectorAll(".carte.aime").length;
  document.querySelector(".nb-favoris").textContent = "♥ Favoris : " + nb;
}

// ===== Étape 7 : le formulaire de contact =====
const contact = document.querySelector(".contact");

contact.addEventListener("submit", (event) => {
  event.preventDefault();
  const nom = document.querySelector("#nom").value;
  const email = document.querySelector("#email").value;
  const message = document.querySelector("#message").value;
  const erreur = document.querySelector(".erreur");
  const succes = document.querySelector(".succes");

  if (nom === "") {
    erreur.textContent = "Le nom est obligatoire";
  } else if (!email.includes("@")) {
    erreur.textContent = "Adresse e-mail invalide";
  } else if (message.length < 10) {
    erreur.textContent = "Message trop court";
  } else {
    erreur.textContent = "";
    succes.textContent = "Merci " + nom + ", message envoyé !";
  }
});`
  },

  appli: {
    label: "L’appli mobile", short: "Suivre ses habitudes, ses lectures, ses séries…",
    pitch: "Une appli de suivi pensée pour le téléphone : habitudes, lectures, séries, collection ou tâches. On coche, on ajoute, on supprime, et une progression suit tout.",
    ideas: ["tes habitudes de la semaine", "les livres ou séries à voir", "ta collection (vinyles, plantes…)", "les tâches d’un projet"],
    features: ["une liste en cartes", "des filtres par catégorie", "cocher fait / à faire, avec une progression", "supprimer un élément", "un mode sombre", "ajouter un élément avec un formulaire"],
    data: "elements", titleKey: "nom",
    fields: [["nom", "string", "ce qu’il faut suivre"], ["categorie", "string", "pour les filtres"], ["fait", "boolean", "true ou false, sans guillemets"]],
    example: `{ nom: "Lire 20 pages", categorie: "Lectures", fait: false }`,
    mock: `<div class="mk mk-dark" style="max-width:220px"><div class="mk-body mk-col"><p class="mk-h">Petits pas</p><p class="mk-small">2 / 4 faits</p><ul class="mk-list mk-check-list"><li class="done">Boire de l’eau</li><li>Lire 20 pages</li><li class="done">Dessiner</li></ul><span class="mk-btn" style="background:#FFC93C;color:#161B2E">+ Ajouter</span></div></div>`,
    html: `<div class="app">
  <header class="entete">
    <div>
      <h1 class="titre">Mon projet</h1>
      <p class="slogan">Mon slogan</p>
      <p class="progression">0 / 0 faits</p><!--@6-->
    </div>
    <button class="theme">Mode sombre</button>
  </header>

  <nav class="filtres">
    <button class="filtre">Tout</button><!--@5-->
    <button class="filtre">Habitudes</button><!--@5-->
    <button class="filtre">Lectures</button><!--@5-->
  </nav>

  <main class="grille"></main>

  <form class="ajout"><!--@7-->
    <h2>Ajouter</h2><!--@7-->
    <input id="nom-element" type="text" placeholder="Nouvel élément"><!--@7-->
    <input id="categorie-element" type="text" placeholder="Catégorie"><!--@7-->
    <button type="submit">Ajouter</button><!--@7-->
  </form><!--@7-->
</div>`,
    js: `// ===== Étape 1 : les données =====
const nomProjet = "Petits pas";
const slogan = "Mes habitudes, un jour à la fois";
let elements = [
  { nom: "Boire 1,5 L d'eau", categorie: "Habitudes", fait: true },
  { nom: "Lire 20 pages", categorie: "Lectures", fait: false },
  { nom: "10 min de dessin", categorie: "Habitudes", fait: false },
  { nom: "Finir Dune", categorie: "Lectures", fait: false }
];
console.log(elements.length + " éléments");
console.log(elements[elements.length - 1].nom);

// ===== Étape 2 : une fonction utile =====
function compterFaits(liste) {
  return liste.filter((element) => element.fait).length;
}
console.log(compterFaits(elements) + " faits");

// ===== Étape 3 : l'en-tête et le mode sombre =====
const app = document.querySelector(".app");
const boutonTheme = document.querySelector(".theme");
document.querySelector(".titre").textContent = nomProjet;
document.querySelector(".slogan").textContent = slogan;

boutonTheme.addEventListener("click", () => {
  app.classList.toggle("sombre");
  if (app.classList.contains("sombre")) {
    boutonTheme.textContent = "Mode clair";
  } else {
    boutonTheme.textContent = "Mode sombre";
  }
});

// ===== Étape 4 : l'affichage des cartes =====
const grille = document.querySelector(".grille");

function afficher(liste) {
  grille.innerHTML = "";
  liste.forEach((element) => {
    const carte = document.createElement("article");
    carte.classList.add("carte");
    if (element.fait) { //@6
      carte.classList.add("fait"); //@6
    } //@6

    const nom = document.createElement("h2");
    nom.textContent = element.nom;
    const categorie = document.createElement("p");
    categorie.textContent = element.categorie;
    carte.appendChild(nom);
    carte.appendChild(categorie);

    const cocher = document.createElement("button"); //@6
    cocher.classList.add("cocher"); //@6
    cocher.textContent = element.fait ? "À refaire" : "Fait !"; //@6
    cocher.addEventListener("click", () => { //@6
      element.fait = !element.fait; //@6
      afficher(liste); //@6
    }); //@6
    carte.appendChild(cocher); //@6

    const supprimer = document.createElement("button"); //@6
    supprimer.classList.add("supprimer"); //@6
    supprimer.textContent = "Supprimer"; //@6
    supprimer.addEventListener("click", () => { //@6
      elements = elements.filter((e) => e !== element); //@6
      afficher(elements); //@6
    }); //@6
    carte.appendChild(supprimer); //@6

    grille.appendChild(carte);
  });
  document.querySelector(".progression").textContent = compterFaits(elements) + " / " + elements.length + " faits"; //@6
}

afficher(elements);

// ===== Étape 5 : les filtres =====
document.querySelectorAll(".filtre").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const choix = bouton.textContent;
    if (choix === "Tout") {
      afficher(elements);
    } else {
      afficher(elements.filter((element) => element.categorie === choix));
    }
  });
});

// ===== Étape 6 : cocher et supprimer =====
// (le code de cette étape est dans la fonction afficher)

// ===== Étape 7 : ajouter avec un formulaire =====
const formulaire = document.querySelector(".ajout");

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  const champNom = document.querySelector("#nom-element");
  const champCategorie = document.querySelector("#categorie-element");
  if (champNom.value !== "") {
    elements.push({ nom: champNom.value, categorie: champCategorie.value, fait: false });
    champNom.value = "";
    afficher(elements);
  }
});`
  },

  boutique: {
    label: "La boutique en ligne", short: "Un e-shop avec un vrai panier",
    pitch: "La boutique d’une marque, d’un artiste ou d’un créateur : un catalogue filtrable, un panier qui calcule le total, et un formulaire de commande.",
    ideas: ["tes propres créations (affiches, stickers…)", "une marque de vêtements", "un disquaire ou une librairie", "un fleuriste ou une épicerie fine"],
    features: ["un catalogue en cartes avec les prix", "des filtres par catégorie", "un panier qui calcule le total", "retirer un article du panier", "un mode sombre", "un formulaire de commande vérifié"],
    data: "produits", titleKey: "nom",
    fields: [["nom", "string", "le nom du produit"], ["prix", "number", "un nombre, sans guillemets ni €"], ["categorie", "string", "pour les filtres"]],
    example: `{ nom: "Tote bag", prix: 15, categorie: "Accessoires" }`,
    mock: `<div class="mk"><div class="mk-bar"><span>encre-et-papier.shop</span></div><div class="mk-body mk-col"><div class="mk-grid"><div class="mk-tile t3"><b>Affiche</b><small>25 €</small></div><div class="mk-tile t1"><b>Tote bag</b><small>15 €</small></div><div class="mk-tile t2"><b>Carnet</b><small>12 €</small></div></div><div class="mk-line mk-total"><span>Panier (2)</span><b>40 €</b></div><span class="mk-btn">Commander</span></div></div>`,
    html: `<div class="app">
  <header class="entete">
    <div>
      <h1 class="titre">Mon projet</h1>
      <p class="slogan">Mon slogan</p>
    </div>
    <button class="theme">Mode sombre</button>
  </header>

  <nav class="filtres">
    <button class="filtre">Tout</button><!--@5-->
    <button class="filtre">Affiches</button><!--@5-->
    <button class="filtre">Accessoires</button><!--@5-->
  </nav>

  <main class="grille"></main>

  <aside class="panier-bloc"><!--@6-->
    <h2>Mon panier</h2><!--@6-->
    <ul class="panier"></ul><!--@6-->
    <p class="total">Total : 0 €</p><!--@6-->
    <form class="commande"><!--@7-->
      <label for="prenom">Prénom</label><!--@7-->
      <input id="prenom" type="text"><!--@7-->
      <button type="submit">Commander</button><!--@7-->
      <p class="erreur"></p><!--@7-->
      <p class="succes"></p><!--@7-->
    </form><!--@7-->
  </aside><!--@6-->
</div>`,
    js: `// ===== Étape 1 : les données =====
const nomProjet = "Encre & Papier";
const slogan = "Affiches et objets imprimés à Nice";
const produits = [
  { nom: "Affiche Lueurs", prix: 25, categorie: "Affiches" },
  { nom: "Tote bag", prix: 15, categorie: "Accessoires" },
  { nom: "Carnet", prix: 12, categorie: "Accessoires" },
  { nom: "Affiche Collines", prix: 30, categorie: "Affiches" }
];
console.log(produits.length + " produits");
console.log(produits[produits.length - 1].nom);

// ===== Étape 2 : une fonction utile =====
function totalPrix(liste) {
  let total = 0;
  liste.forEach((produit) => {
    total = total + produit.prix;
  });
  return total;
}
console.log(totalPrix(produits) + " €");

// ===== Étape 3 : l'en-tête et le mode sombre =====
const app = document.querySelector(".app");
const boutonTheme = document.querySelector(".theme");
document.querySelector(".titre").textContent = nomProjet;
document.querySelector(".slogan").textContent = slogan;

boutonTheme.addEventListener("click", () => {
  app.classList.toggle("sombre");
  if (app.classList.contains("sombre")) {
    boutonTheme.textContent = "Mode clair";
  } else {
    boutonTheme.textContent = "Mode sombre";
  }
});

// ===== Étape 4 : l'affichage des cartes =====
const grille = document.querySelector(".grille");

function afficher(liste) {
  grille.innerHTML = "";
  liste.forEach((produit) => {
    const carte = document.createElement("article");
    carte.classList.add("carte");

    const nom = document.createElement("h2");
    nom.textContent = produit.nom;
    const prix = document.createElement("p");
    prix.textContent = produit.prix + " €";
    const categorie = document.createElement("p");
    categorie.textContent = produit.categorie;
    carte.appendChild(nom);
    carte.appendChild(prix);
    carte.appendChild(categorie);

    const ajouter = document.createElement("button"); //@6
    ajouter.classList.add("ajouter"); //@6
    ajouter.textContent = "Ajouter au panier"; //@6
    ajouter.addEventListener("click", () => { //@6
      panier.push(produit); //@6
      afficherPanier(); //@6
    }); //@6
    carte.appendChild(ajouter); //@6

    grille.appendChild(carte);
  });
}

afficher(produits);

// ===== Étape 5 : les filtres =====
document.querySelectorAll(".filtre").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    const choix = bouton.textContent;
    if (choix === "Tout") {
      afficher(produits);
    } else {
      afficher(produits.filter((produit) => produit.categorie === choix));
    }
  });
});

// ===== Étape 6 : le panier =====
const panier = [];

function afficherPanier() {
  const liste = document.querySelector(".panier");
  liste.innerHTML = "";
  panier.forEach((produit, index) => {
    const li = document.createElement("li");
    li.textContent = produit.nom + " · " + produit.prix + " € ";
    const retirer = document.createElement("button");
    retirer.classList.add("retirer");
    retirer.textContent = "✕";
    retirer.addEventListener("click", () => {
      panier.splice(index, 1);
      afficherPanier();
    });
    li.appendChild(retirer);
    liste.appendChild(li);
  });
  document.querySelector(".total").textContent = "Total : " + totalPrix(panier) + " €";
}

// ===== Étape 7 : la commande =====
const commande = document.querySelector(".commande");

commande.addEventListener("submit", (event) => {
  event.preventDefault();
  const prenom = document.querySelector("#prenom").value;
  const erreur = document.querySelector(".erreur");
  const succes = document.querySelector(".succes");

  if (panier.length === 0) {
    erreur.textContent = "Ton panier est vide";
  } else if (prenom === "") {
    erreur.textContent = "Le prénom est obligatoire";
  } else {
    erreur.textContent = "";
    succes.textContent = "Merci " + prenom + ", commande de " + panier.length + " articles validée !";
  }
});`
  }
};

/* ---------- outils des tests du projet ---------- */
const PJ = {
  data: c => V(c.runs[0], c.P.data),
  cards: st => [...st.querySelectorAll(".grille .carte")],
  titles: (st, P) => PJ.cards(st).map(x => norm(x.textContent)),
  matches: (st, list, P) => { const cs = PJ.cards(st); return cs.length === list.length && list.every((it, i) => norm(cs[i].textContent).includes(norm(it[P.titleKey]))); },
  cats: list => [...new Set(list.map(x => x.categorie))],
  fresh: c => freshRun(c),
  num: t => { const m = String(t || "").replace(",", ".").match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; }
};

/* ---------- les étapes ---------- */
function projectSteps(type) {
  const P = PROJECT_TYPES[type];
  const fieldsText = P.fields.map(([k, t, d]) => "`" + k + "` (" + ({ string: "texte", number: "nombre", boolean: "true/false" }[t]) + " : " + d + ")").join(", ");
  const steps = [];
  /* ----- 1 ----- */
  steps.push({
    n: 1, title: "Tes données", notion: "variables, tableau d’objets, length - 1", needs: "lumen-mission", diagrams: ["array", "object"],
    intro: "Tout commence par les données : ce que le site va afficher. Le client t’a envoyé ses contenus dans le **brief** (plus bas). Ton travail : les ranger dans un tableau d’objets, comme le ferait un CMS. Le HTML et le CSS sont déjà prêts : tu ne codes que le JavaScript.",
    instructions: ["Crée `nomProjet` et `slogan` : deux textes, avec le nom et le slogan du client (voir le brief).", "Crée `" + P.data + "` : un tableau d’objets avec les contenus du brief (**au moins 4**, les 6 c’est mieux). Chaque objet a ces étiquettes : " + fieldsText + ".", "Exemple d’un objet : `" + P.example + "`", "Les catégories doivent être **exactement** celles des boutons de filtre du HTML : " + P.categories.map(c => "`" + c + "`").join(", ") + " (majuscules et accents compris).", "Affiche dans la console le nombre d’éléments (`length`), puis le " + P.titleKey + " du **dernier** élément, avec `length - 1`."],
    goals: [
      { label: "`nomProjet` et `slogan` sont des textes", test: c => { const a = V(c.runs[0], "nomProjet"), b = V(c.runs[0], "slogan"); return typeof a === "string" && a.trim() !== "" && typeof b === "string" && b.trim() !== ""; } },
      { label: "`" + P.data + "` est un tableau d’au moins 4 éléments", test: c => { const d = PJ.data(c); if (!Array.isArray(d)) return false; return d.length >= 4 || "Il n’y a que " + d.length + " élément(s) : il en faut au moins 4."; } },
      { label: "Chaque élément a les bonnes étiquettes, avec le bon type", test: c => { const d = PJ.data(c); if (!Array.isArray(d)) return false; for (let i = 0; i < d.length; i++) { const it = d[i]; if (!it || typeof it !== "object") return "L’élément [" + i + "] n’est pas un objet : il faut des accolades `{ }`."; for (const [k, t] of P.fields) { if (!(k in it)) return "L’élément [" + i + "] n’a pas d’étiquette `" + k + "`."; if (typeof it[k] !== t) return "L’élément [" + i + "] : `" + k + "` doit être " + ({ string: "un texte (entre guillemets)", number: "un nombre (sans guillemets)", boolean: "true ou false (sans guillemets)" }[t]) + "."; } } return true; } },
      { label: "Les catégories sont celles du HTML (" + P.categories.join(", ") + ") et chacune est utilisée", test: c => { const d = PJ.data(c); if (!Array.isArray(d)) return false; const bad = d.find(x => x && !P.categories.includes(x.categorie)); if (bad) return "« " + bad.categorie + " » n’est pas une catégorie du HTML. Choisis parmi : " + P.categories.join(", ") + "."; const miss = P.categories.filter(k => !d.some(x => x && x.categorie === k)); return !miss.length || "Aucun élément dans la catégorie « " + miss[0] + " » : le bouton de filtre serait vide."; } },
      { label: "La console affiche le nombre d’éléments et le dernier (avec `length - 1`)", test: c => { const d = PJ.data(c); if (!Array.isArray(d) || !d.length) return false; const last = d[d.length - 1][P.titleKey]; if (!/length\s*-\s*1/.test(c.code)) return "Vise le dernier élément avec `length - 1`, pas avec son numéro écrit à la main."; const ts = logTexts(c.main); return (hasArg(c.main, a => a === d.length) || ts.some(t => t.includes(String(d.length)))) && ts.some(t => t.includes(last)); } }
    ],
    hints: ["Un texte : `const nomProjet = \"…\";`. Un tableau d’objets : `const " + P.data + " = [ { … }, { … } ];` avec une virgule entre chaque objet.", "Chaque objet : `" + P.example + "`. Les nombres et les booléens sans guillemets. Les catégories : copie-les depuis les boutons de index.html, lettre par lettre.", "`console.log(" + P.data + ".length);` puis `console.log(" + P.data + "[" + P.data + ".length - 1]." + P.titleKey + ");`"],
    check: [{ q: "Pourquoi `" + P.data + "[" + P.data + ".length - 1]` plutôt que `" + P.data + "[5]` ?", opts: ["`[5]` est interdit", "Le nombre d’éléments va changer : `length - 1` vise toujours le dernier", "C’est pareil"], a: 1, why: "Tu ajouteras des éléments : un numéro écrit à la main deviendrait faux." }, { q: "Pourquoi ranger chaque élément dans un objet ?", opts: ["Pour garder ensemble toutes ses infos, avec des étiquettes", "Les tableaux ne peuvent pas contenir de texte", "Pour que la page soit plus rapide"], a: 0, why: "Un objet = une fiche. Le tableau = la liste des fiches." }],
    explain: "Explique avec tes mots comment tes données sont rangées : à quoi sert le tableau, à quoi servent les objets ?"
  });
  /* ----- 2 ----- */
  const f2 = {
    site: { name: "compterCategorie", sig: "compterCategorie(categorie)", what: "renvoie le **nombre** de projets de cette catégorie (astuce : `filter` puis `.length`)", use: "Affiche dans la console le résultat pour une de tes catégories.",
      goals: [{ label: "`compterCategorie` renvoie le bon nombre pour chaque catégorie", test: c => { const f = V(c.runs[0], "compterCategorie"), d = PJ.data(c); if (typeof f !== "function" || !Array.isArray(d)) return false; for (const cat of PJ.cats(d)) { const r = f(cat); if (r !== d.filter(x => x.categorie === cat).length) return "`compterCategorie(\"" + cat + "\")` renvoie " + fmt(r, false) + "."; } return f("Catégorie inconnue") === 0 || "Avec une catégorie qui n’existe pas, la fonction doit renvoyer 0."; } }],
      hints: ["`function compterCategorie(categorie) { … }`", "Dedans : `return projets.filter((projet) => ___ ).length;`", "Le test : `projet.categorie === categorie`."] },
    appli: { name: "compterFaits", sig: "compterFaits(liste)", what: "renvoie le **nombre** d’éléments de `liste` qui sont faits (`fait` vaut true)", use: "Affiche dans la console `compterFaits(elements)`.",
      goals: [{ label: "`compterFaits` compte les éléments faits", test: c => { const f = V(c.runs[0], "compterFaits"), d = PJ.data(c); if (typeof f !== "function" || !Array.isArray(d)) return false; const r = f(d); if (r !== d.filter(x => x.fait).length) return "`compterFaits(elements)` renvoie " + fmt(r, false) + "."; return (f([{ fait: true }, { fait: true }, { fait: false }]) === 2 && f([]) === 0) || "La fonction doit compter dans la **liste reçue** en paramètre, pas dans `elements`."; } }],
      hints: ["`function compterFaits(liste) { … }`", "Dedans : `return liste.filter((element) => ___ ).length;`", "Le test : `element.fait` (c’est déjà un booléen)."] },
    boutique: { name: "totalPrix", sig: "totalPrix(liste)", what: "renvoie la **somme** des prix des produits de `liste`", use: "Affiche dans la console `totalPrix(produits)`.",
      goals: [{ label: "`totalPrix` additionne les prix", test: c => { const f = V(c.runs[0], "totalPrix"), d = PJ.data(c); if (typeof f !== "function" || !Array.isArray(d)) return false; const r = f(d), exp = d.reduce((s, x) => s + x.prix, 0); if (!near(r, exp)) return "`totalPrix(produits)` renvoie " + fmt(r, false) + " au lieu de " + exp + "."; return (near(f([{ prix: 10 }, { prix: 5.5 }]), 15.5) && f([]) === 0) || "La fonction doit additionner les prix de la **liste reçue** en paramètre."; } }],
      hints: ["`function totalPrix(liste) { let total = 0; … return total; }`", "Entre les deux : `liste.forEach((produit) => { … });`", "Dans la boucle : `total = total + produit.prix;`"] }
  }[type];
  steps.push({
    n: 2, title: "Une fonction utile", notion: "function, return", needs: "lou-mission", diagrams: ["function"],
    intro: "Une fonction que ton projet va réutiliser plusieurs fois. Tu l’écris maintenant, tu t’en serviras dans les prochaines étapes.",
    instructions: ["Écris la fonction `" + f2.sig + "` : elle " + f2.what + ".", f2.use, "Le jeu va la tester avec tes données **et** avec d’autres listes."],
    goals: f2.goals.concat([{ label: "La console affiche un résultat de ta fonction", test: c => new RegExp("console\\.log\\([^;]*" + f2.name + "\\(").test(c.code) }]),
    hints: f2.hints,
    check: [{ q: "Pourquoi un paramètre plutôt que d’utiliser directement `" + P.data + "` dans la fonction ?", opts: ["Pour pouvoir l’utiliser avec n’importe quelle liste ou valeur, pas une seule", "C’est obligatoire en JavaScript", "Pour aller plus vite"], a: 0, why: "Tu vas t’en resservir avec d’autres valeurs (un filtre, un panier…)." }],
    explain: "Explique ce que fait ta fonction : ce qui entre (le paramètre), ce qui se passe dedans, ce qui sort (le return)."
  });
  /* ----- 3 ----- */
  steps.push({
    n: 3, title: "L’en-tête et le mode sombre", notion: "querySelector, textContent, classList", needs: "pixa-mission", diagrams: ["dom", "event"],
    intro: "La page affiche le nom et le slogan du client, et le visiteur peut passer en mode sombre. Les couleurs du mode sombre sont déjà dans style.css (la règle `.app.sombre`) : ton JavaScript n’a qu’à poser la classe.",
    instructions: ["Écris `nomProjet` dans `.titre` et `slogan` dans `.slogan`, avec `textContent`.", "Au clic sur le bouton `.theme` : ajoute ou enlève la classe `sombre` sur `.app` (`classList.toggle`).", "Le bouton affiche `Mode clair` quand l’app est sombre, et `Mode sombre` sinon.", "Ouvre l’onglet **style.css** et trouve la règle `.app.sombre` : c’est elle qui s’active quand ton JS ajoute la classe. Regarde l’**Aperçu** en mobile puis en ordinateur."],
    goals: [
      { label: "`.titre` affiche `nomProjet` et `.slogan` affiche `slogan`", test: c => { const r = PJ.fresh(c); return txt(r.stage, ".titre") === norm(V(r, "nomProjet") || "?") && txt(r.stage, ".slogan") === norm(V(r, "slogan") || "?"); } },
      { label: "Le bouton `.theme` passe en sombre (et affiche `Mode clair`)", test: c => { const r = PJ.fresh(c); const b = r.stage.querySelector(".theme"), a = r.stage.querySelector(".app"); if (!b || !a) return "Il manque `.theme` ou `.app` dans index.html."; b.click(); if (!a.classList.contains("sombre")) return false; return norm(b.textContent) === "Mode clair" || "L’app est sombre, mais le bouton ne dit pas « Mode clair »."; } },
      { label: "Un 2e clic revient en clair (`Mode sombre`)", test: c => { const r = PJ.fresh(c); const b = r.stage.querySelector(".theme"), a = r.stage.querySelector(".app"); if (!b) return false; b.click(); b.click(); return !a.classList.contains("sombre") && norm(b.textContent) === "Mode sombre"; } }
    ],
    hints: ["`document.querySelector(\".titre\").textContent = nomProjet;` (pareil pour le slogan).", "`const app = document.querySelector(\".app\");` et `const boutonTheme = document.querySelector(\".theme\");` puis `boutonTheme.addEventListener(\"click\", () => { … });`", "Dans la fonction : `app.classList.toggle(\"sombre\");` puis un `if (app.classList.contains(\"sombre\")) { … } else { … }` pour le texte."],
    check: [{ q: "Pourquoi les couleurs du mode sombre sont dans style.css et pas dans le JavaScript ?", opts: ["Le JS change un état (la classe), le CSS décide du look : tu peux redessiner le mode sombre sans toucher au JS", "JavaScript ne connaît pas les couleurs", "C’est plus rapide"], a: 0, why: "Chacun son rôle : c’est ce qui rend un projet facile à faire évoluer." }],
    explain: "Raconte le trajet complet : du clic sur le bouton jusqu’au changement de couleurs à l’écran."
  });
  /* ----- 4 ----- */
  const cardSpec = { site: "un `h2` avec le titre, un `p` avec « catégorie · année », un `p` avec la description", appli: "un `h2` avec le nom, un `p` avec la catégorie", boutique: "un `h2` avec le nom, un `p` avec le prix suivi de « € », un `p` avec la catégorie" }[type];
  steps.push({
    n: 4, title: "L’affichage des cartes", notion: "createElement, forEach, afficher()", needs: "malin-completer", diagrams: ["create", "render"],
    intro: "Le cœur de ton projet : chaque élément de tes données devient une carte sur la page. Change tes données, la page suit.",
    instructions: ["Récupère `.grille`.", "Écris une fonction `afficher(liste)` qui **vide** la grille, puis crée une carte pour chaque élément de `liste`.", "Chaque carte est un `article` avec la classe `carte`, qui contient : " + cardSpec + ".", "Appelle `afficher(" + P.data + ")` pour tout afficher au chargement."],
    goals: [
      { label: "`afficher` est une fonction", test: c => typeof V(c.runs[0], "afficher") === "function" },
      { label: "Une carte `.carte` par élément, dans l’ordre", test: c => { const r = PJ.fresh(c), d = V(r, P.data); if (!Array.isArray(d)) return false; const cs = PJ.cards(r.stage); if (!cs.length) return r.stage.querySelectorAll(".grille > *").length ? "Les cartes n’ont pas la classe `carte`." : "La grille est vide : as-tu appelé `afficher(" + P.data + ")` ?"; return PJ.matches(r.stage, d, P) || (cs.length === 1 && d.length > 1 ? "Une seule carte pour " + d.length + " éléments : avec `=`, chaque tour de `forEach` **remplace** la carte d’avant. Utilise `+=` pour **ajouter** à la suite." : cs.length !== d.length ? cs.length + " cartes pour " + d.length + " éléments." : "Une carte ne contient pas le " + P.titleKey + " de son élément."); } },
      { label: "`afficher(liste)` affiche la liste reçue (et vide la grille avant)", test: c => { const r = PJ.fresh(c), f = V(r, "afficher"), d = V(r, P.data); if (typeof f !== "function" || !Array.isArray(d)) return false; silent = true; try { f(d.slice(0, 2)); } catch (e) { silent = false; return "`afficher` plante : " + e.message; } silent = false; const n = PJ.cards(r.stage).length; if (n === d.length + 2) return "Les cartes s’ajoutent aux anciennes : vide la grille au début d’`afficher`."; if (n === 1) return "Avec 2 éléments, une seule carte : utilise `+=` au lieu de `=` dans le `forEach`."; return n === 2 || (n === d.length || n === 2 * d.length ? "`afficher(liste)` doit utiliser son paramètre `liste`, pas `" + P.data + "`." : "`afficher` reçoit 2 éléments mais affiche " + n + " cartes."); } }
    ].concat(type === "boutique" ? [{ label: "Chaque carte affiche le prix", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const cs = PJ.cards(r.stage); return Array.isArray(d) && cs.length === d.length && d.every((p, i) => norm(cs[i].textContent).includes(String(p.prix))); } }] : []),
    hints: ["`const grille = document.querySelector(\".grille\");` puis `function afficher(liste) { grille.innerHTML = \"\"; … }`", "Dans `afficher` : `liste.forEach((element) => { const carte = document.createElement(\"article\"); carte.classList.add(\"carte\"); … });`", "Pour chaque morceau : `createElement`, `textContent`, `carte.appendChild(…)`. Puis `grille.appendChild(carte);` et, en dehors de la fonction, `afficher(" + P.data + ");`"],
    check: [{ q: "Pourquoi `afficher` reçoit une `liste` au lieu d’utiliser directement `" + P.data + "` ?", opts: ["Pour afficher ce qu’on veut : tout, ou une liste filtrée (étape suivante)", "Parce que " + P.data + " n’est pas accessible", "C’est pareil"], a: 0, why: "La même fonction servira pour les filtres : on lui donnera une liste réduite." }, { q: "Pourquoi vider la grille au début d’`afficher` ?", opts: ["Sinon chaque appel ajoute les cartes à la suite des anciennes", "Pour effacer les données", "Ce n’est pas utile"], a: 0, why: "On redessine à partir de zéro, à chaque fois." }],
    explain: "Explique comment une donnée de ton tableau devient une carte visible sur la page (les 3 gestes : fabriquer, remplir, accrocher)."
  });
  /* ----- 5 ----- */
  steps.push({
    n: 5, title: "Les filtres", notion: "querySelectorAll, filter, click", needs: "malin-completer", diagrams: ["filter", "event"],
    intro: "Le visiteur choisit une catégorie, la page ne montre que les éléments concernés. Les boutons sont déjà dans le HTML : ton JavaScript va les rendre utiles.",
    lesson: { what: "`document.querySelectorAll(\".filtre\")` attrape **tous** les éléments qui ont la classe `filtre`. Avec `forEach`, on branche un écouteur sur chacun. `bouton.textContent` donne le texte du bouton cliqué : on s’en sert comme catégorie.", code: `document.querySelectorAll(".filtre").forEach((bouton) => {\n  bouton.addEventListener("click", () => {\n    const choix = bouton.textContent;\n  });\n});`, pieces: [["querySelectorAll", "tous les éléments, pas seulement le premier"], ["forEach((bouton) => …)", "un écouteur par bouton"], ["bouton.textContent", "le texte du bouton cliqué"]], trap: "Le texte du bouton doit être **exactement** le nom de la catégorie dans tes données (majuscules et accents compris)." },
    instructions: ["Ouvre **index.html** et trouve `<nav class=\"filtres\">` : un bouton `Tout` et un bouton par catégorie, chacun avec la classe `filtre`.", "Dans **script.js**, avec `document.querySelectorAll(\".filtre\")` et `forEach`, branche un écouteur de clic sur chaque bouton.", "Au clic : si le texte du bouton est `Tout`, affiche tout ; sinon, affiche seulement les éléments de cette catégorie (`filter`), avec ta fonction `afficher`."],
    goals: [
      { label: "Chaque bouton de filtre correspond à une catégorie de tes données", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const bs = [...r.stage.querySelectorAll(".filtre")].map(b => norm(b.textContent)); if (!bs.includes("Tout")) return "Il manque un bouton `Tout` avec la classe `filtre`."; const cats = bs.filter(t => t !== "Tout"); if (!cats.length) return "Ajoute au moins un bouton de catégorie."; const known = Array.isArray(d) ? PJ.cats(d) : []; const bad = cats.filter(t => !known.includes(t)); return !bad.length || "Le bouton « " + bad[0] + " » ne correspond à aucune catégorie de tes données (" + known.join(", ") + ")."; } },
      { label: "Chaque bouton de catégorie n’affiche que ses éléments", test: c => { const r0 = PJ.fresh(c); const labels = [...r0.stage.querySelectorAll(".filtre")].map(b => norm(b.textContent)).filter(t => t !== "Tout"); if (!labels.length) return false; for (const lab of labels) { const r = PJ.fresh(c), d = V(r, P.data); const b = [...r.stage.querySelectorAll(".filtre")].find(x => norm(x.textContent) === lab); b.click(); const want = d.filter(x => x.categorie === lab); if (!PJ.matches(r.stage, want, P)) return "Avec « " + lab + " », j’attendais " + want.length + " carte(s), il y en a " + PJ.cards(r.stage).length + "."; } return true; } },
      { label: "`Tout` réaffiche tous les éléments", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const bs = [...r.stage.querySelectorAll(".filtre")]; const other = bs.find(b => norm(b.textContent) !== "Tout"), tout = bs.find(b => norm(b.textContent) === "Tout"); if (!other || !tout) return false; other.click(); tout.click(); return PJ.matches(r.stage, d, P); } }
    ],
    hints: ["Le texte de chaque bouton (`Affiches`, `Tout`…) est ce que tu compares à `categorie`. Vérifie qu’ils sont écrits pareil.", "JS : `document.querySelectorAll(\".filtre\").forEach((bouton) => { bouton.addEventListener(\"click\", () => { … }); });`", "Dans le clic : `const choix = bouton.textContent;` puis `if (choix === \"Tout\") { afficher(" + P.data + "); } else { afficher(" + P.data + ".filter((x) => x.categorie === choix)); }`"],
    check: [{ q: "Après un clic sur un filtre, que contient `" + P.data + "` ?", opts: ["Toujours tous les éléments : filter crée un nouveau tableau, donné à afficher", "Seulement les éléments filtrés", "Il est vide"], a: 0, why: "C’est ce qui permet de revenir à « Tout »." }],
    explain: "Explique ce qui se passe entre le clic sur un bouton de filtre et l’affichage des nouvelles cartes."
  });
  /* ----- 6 et 7 : propres à chaque projet ----- */
  if (type === "site") {
    steps.push({
      n: 6, title: "Les favoris", notion: "classList.toggle, querySelectorAll().length", needs: "malin-bouton", diagrams: ["event", "dom"],
      intro: "Le visiteur peut aimer des réalisations : la carte s’entoure de ta couleur d’accent et un compteur suit le nombre de favoris.",
      instructions: ["Le compteur existe déjà dans index.html : `<p class=\"nb-favoris\">`.", "Dans `afficher`, ajoute à chaque carte un bouton avec la classe `favori` (texte : `♥ J’aime`).", "Au clic sur ce bouton : ajoute ou enlève la classe `aime` sur **sa** carte, puis appelle `compterFavoris()`.", "Écris `compterFavoris()` : elle compte les cartes aimées (`document.querySelectorAll(\".carte.aime\").length`) et l’affiche dans `.nb-favoris` (ex. `2 favori`)."],
      goals: [
        { label: "Chaque carte a un bouton `.favori`", test: c => { const r = PJ.fresh(c); const cs = PJ.cards(r.stage); return cs.length > 0 && cs.every(x => x.querySelector(".favori")); } },
        { label: "Un clic : la carte reçoit `aime` et le compteur affiche 1", test: c => { const r = PJ.fresh(c); const cs = PJ.cards(r.stage); if (!cs.length || !cs[0].querySelector(".favori")) return false; cs[0].querySelector(".favori").click(); if (!cs[0].classList.contains("aime")) return "La carte cliquée n’a pas reçu la classe `aime`."; return PJ.num(txt(r.stage, ".nb-favoris")) === 1 || "`.nb-favoris` affiche « " + txt(r.stage, ".nb-favoris") + " »."; } },
        { label: "Deux cartes aimées puis une retirée : le compteur suit (2 puis 1)", test: c => { const r = PJ.fresh(c); const cs = PJ.cards(r.stage); if (cs.length < 2) return false; cs[0].querySelector(".favori").click(); cs[1].querySelector(".favori").click(); if (PJ.num(txt(r.stage, ".nb-favoris")) !== 2) return false; cs[0].querySelector(".favori").click(); return PJ.num(txt(r.stage, ".nb-favoris")) === 1 && !cs[0].classList.contains("aime"); } }
      ],
      hints: ["Dans le `forEach` d’`afficher`, après les autres morceaux : `const favori = document.createElement(\"button\");` puis la classe et le texte.", "`favori.addEventListener(\"click\", () => { carte.classList.toggle(\"aime\"); compterFavoris(); });` puis `carte.appendChild(favori);`", "`function compterFavoris() { const nb = document.querySelectorAll(\".carte.aime\").length; document.querySelector(\".nb-favoris\").textContent = \"♥ Favoris : \" + nb; }`"],
      check: [{ q: "Comment le bouton sait-il quelle carte aimer ?", opts: ["Il est créé dans le même tour de boucle que sa carte : la variable `carte` de ce tour est la sienne", "Il cherche la carte avec querySelector", "Il aime toutes les cartes"], a: 0, why: "Chaque tour du forEach a ses propres variables `carte` et `favori`." }],
      explain: "Explique comment le clic sur un ♥ change à la fois la carte et le compteur."
    });
    steps.push({
      n: 7, title: "Le formulaire de contact", notion: "submit, value, conditions", needs: "malin-bouton", diagrams: ["form"],
      intro: "La touche finale d’un site vitrine : un formulaire de contact qui vérifie ce que le visiteur a tapé avant d’envoyer.",
      instructions: ["Le formulaire `.contact` est déjà dans index.html : repère les `id` des champs (`#nom`, `#email`, `#message`) et les paragraphes `.erreur` et `.succes`.", "À l’envoi : empêche le rechargement de la page.", "Si le nom est vide → `.erreur` affiche `Le nom est obligatoire`. Sinon si l’e-mail n’a pas de `@` → `Adresse e-mail invalide`. Sinon si le message fait moins de 10 caractères → `Message trop court`.", "Sinon : `.erreur` est vidé et `.succes` affiche `Merci Léa, message envoyé !` (avec le nom tapé)."],
      goals: [
        { label: "Nom vide : `Le nom est obligatoire`", test: c => { const r = PJ.fresh(c); if (!r.stage.querySelector(".contact")) return "Il manque le formulaire `.contact` dans index.html."; typeIn(r.stage, "#email", "a@b.fr"); typeIn(r.stage, "#message", "Bonjour, je voudrais un devis"); submitForm(r.stage, ".contact"); return txt(r.stage, ".erreur") === "Le nom est obligatoire"; } },
        { label: "E-mail sans @ : `Adresse e-mail invalide`", test: c => { const r = PJ.fresh(c); typeIn(r.stage, "#nom", "Léa"); typeIn(r.stage, "#email", "lea.mail.fr"); typeIn(r.stage, "#message", "Bonjour, je voudrais un devis"); submitForm(r.stage, ".contact"); return txt(r.stage, ".erreur") === "Adresse e-mail invalide"; } },
        { label: "Message trop court : `Message trop court`", test: c => { const r = PJ.fresh(c); typeIn(r.stage, "#nom", "Léa"); typeIn(r.stage, "#email", "lea@mail.fr"); typeIn(r.stage, "#message", "Salut"); submitForm(r.stage, ".contact"); return txt(r.stage, ".erreur") === "Message trop court"; } },
        { label: "Tout est bon : `Merci Léa, message envoyé !` et plus d’erreur", test: c => { const r = PJ.fresh(c); typeIn(r.stage, "#nom", "Léa"); typeIn(r.stage, "#email", "x"); typeIn(r.stage, "#message", "Bonjour, je voudrais un devis"); submitForm(r.stage, ".contact"); typeIn(r.stage, "#email", "lea@mail.fr"); submitForm(r.stage, ".contact"); if (txt(r.stage, ".succes") !== "Merci Léa, message envoyé !") return false; return txt(r.stage, ".erreur") === "" || "L’ancienne erreur est restée affichée : vide `.erreur` quand tout est bon."; } },
        { label: "La page ne se recharge pas", test: c => { const r = PJ.fresh(c); return !!r.stage.querySelector(".contact") && submitForm(r.stage, ".contact").defaultPrevented; } }
      ],
      hints: ["`const contact = document.querySelector(\".contact\");` puis `contact.addEventListener(\"submit\", (event) => { event.preventDefault(); … });`", "Dans la fonction, lis les trois champs avec `.value`, puis `if … else if … else if … else`.", "« moins de 10 caractères » : `message.length < 10`. « pas de @ » : `!email.includes(\"@\")`."],
      check: [{ q: "Pourquoi lire les champs **dans** la fonction de l’écouteur ?", opts: ["Parce qu’au chargement ils sont vides : on lit ce que le visiteur a tapé au moment de l’envoi", "Parce que value ne marche que dans les fonctions", "C’est pareil"], a: 0, why: "Le moment où une ligne s’exécute compte autant que ce qu’elle fait." }],
      explain: "Explique le trajet d’un message : de la frappe du visiteur jusqu’au message de succès ou d’erreur."
    });
  }
  if (type === "appli") {
    steps.push({
      n: 6, title: "Cocher et supprimer", notion: "modifier et supprimer une donnée, redessiner", needs: "malin-bouton", diagrams: ["crud", "render"],
      intro: "Ton appli devient vivante : on coche ce qui est fait, on supprime ce qui ne sert plus, et la progression se met à jour toute seule.",
      instructions: ["La progression existe déjà dans index.html : `<p class=\"progression\">`.", "Dans `afficher` : si l’élément est fait, sa carte reçoit la classe `fait`.", "Ajoute à chaque carte un bouton `.cocher` : au clic, `element.fait` s’inverse (`!element.fait`), puis on réaffiche.", "Ajoute à chaque carte un bouton `.supprimer` : au clic, l’élément est retiré de `elements` (avec `filter` ou `splice`), puis on réaffiche.", "À la fin d’`afficher`, `.progression` affiche `2 / 5 faits` grâce à ta fonction `compterFaits` (étape 2)."],
      goals: [
        { label: "`.progression` affiche le bon compte au départ", test: c => { const r = PJ.fresh(c), d = V(r, P.data); if (!Array.isArray(d)) return false; const t = txt(r.stage, ".progression"); return t === d.filter(x => x.fait).length + " / " + d.length + " faits" || "`.progression` affiche « " + t + " » au lieu de « " + d.filter(x => x.fait).length + " / " + d.length + " faits »."; } },
        { label: "Les éléments faits ont la classe `fait`", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const cs = PJ.cards(r.stage); return Array.isArray(d) && cs.length === d.length && d.every((x, i) => cs[i].classList.contains("fait") === x.fait); } },
        { label: "Cliquer sur `.cocher` inverse l’élément et met à jour la progression", test: c => { const r = PJ.fresh(c), d = V(r, P.data); let cs = PJ.cards(r.stage); if (!cs.length || !cs[0].querySelector(".cocher")) return false; const before = d[0].fait; cs[0].querySelector(".cocher").click(); const d2 = V(r, P.data) === d ? d : d; if (d2[0].fait === before) return "`fait` n’a pas changé dans les données : `element.fait = !element.fait;`"; cs = PJ.cards(r.stage); const faits = d2.filter(x => x.fait).length; return (cs[0].classList.contains("fait") === !before && txt(r.stage, ".progression") === faits + " / " + d2.length + " faits") || "Les données ont changé, mais pas la page : réaffiche après le changement."; } },
        { label: "Cliquer sur `.supprimer` retire l’élément", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const cs = PJ.cards(r.stage); if (!cs.length || !cs[0].querySelector(".supprimer")) return false; const name = d[0][P.titleKey]; cs[0].querySelector(".supprimer").click(); const after = PJ.cards(r.stage); if (after.length !== d.length - 1) return after.length === d.length ? "La carte est toujours là : retire l’élément des données, puis réaffiche." : false; return !after.some(x => norm(x.textContent).includes(name)) && PJ.num(txt(r.stage, ".progression").split("/")[1]) === d.length - 1; } }
      ],
      hints: ["Dans le `forEach` : `if (element.fait) { carte.classList.add(\"fait\"); }`", "Bouton cocher : `cocher.addEventListener(\"click\", () => { element.fait = !element.fait; afficher(liste); });`. Bouton supprimer : `elements = elements.filter((e) => e !== element); afficher(elements);` (avec `let elements`).", "Après le `forEach`, dans `afficher` : `document.querySelector(\".progression\").textContent = compterFaits(elements) + \" / \" + elements.length + \" faits\";`"],
      check: [{ q: "Pourquoi modifier `element.fait` puis réafficher, plutôt que changer seulement la classe de la carte ?", opts: ["Les données sont la vérité : la progression et les filtres les lisent. La page suit les données", "Parce que classList ne marche pas ici", "C’est pareil"], a: 0, why: "Si on ne change que la page, les données mentent." }, { q: "Avec `elements = elements.filter(…)`, pourquoi `elements` doit être créé avec `let` ?", opts: ["On range un nouveau tableau dans la boîte : c’est une réaffectation", "Parce que filter l’exige", "Ce n’est pas nécessaire"], a: 0, why: "Avec `splice`, on modifie le tableau existant : `const` suffirait." }],
      explain: "Explique ce qui se passe dans les données puis sur la page quand on coche ou supprime un élément."
    });
    steps.push({
      n: 7, title: "Ajouter avec un formulaire", notion: "submit, push, afficher()", needs: "malin-bouton", diagrams: ["form", "render"],
      intro: "Dernière brique : l’utilisateur ajoute ses propres éléments. Ton appli est complète.",
      instructions: ["Le formulaire `.ajout` est déjà dans index.html : repère les champs `#nom-element` et `#categorie-element`.", "À l’envoi : empêche le rechargement.", "Si le champ `#nom-element` n’est pas vide : ajoute `{ nom, categorie, fait: false }` à `elements` (`push`), vide le champ, puis réaffiche.", "Un champ vide n’ajoute rien."],
      goals: [
        { label: "Ajouter « Courir 20 min » : une carte de plus", test: c => { const r = PJ.fresh(c), n = V(r, P.data).length; if (!r.stage.querySelector(".ajout")) return "Il manque le formulaire `.ajout` dans index.html."; typeIn(r.stage, "#nom-element", "Courir 20 min"); typeIn(r.stage, "#categorie-element", "Sport"); submitForm(r.stage, ".ajout"); const cs = PJ.cards(r.stage); return (cs.length === n + 1 && cs.some(x => norm(x.textContent).includes("Courir 20 min"))) || (cs.length === n ? "Rien n’a été ajouté sur la page : as-tu appelé `afficher` après le push ?" : false); } },
        { label: "La progression compte le nouvel élément", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const n = d.length, f = d.filter(x => x.fait).length; typeIn(r.stage, "#nom-element", "Courir 20 min"); submitForm(r.stage, ".ajout"); return txt(r.stage, ".progression") === f + " / " + (n + 1) + " faits"; } },
        { label: "Le champ est vidé, et un champ vide n’ajoute rien", test: c => { const r = PJ.fresh(c), n = V(r, P.data).length; typeIn(r.stage, "#nom-element", "Test"); submitForm(r.stage, ".ajout"); if (r.stage.querySelector("#nom-element").value !== "") return "Le champ n’est pas vidé après l’ajout."; submitForm(r.stage, ".ajout"); return PJ.cards(r.stage).length === n + 1 || "Un champ vide a ajouté une carte."; } },
        { label: "La page ne se recharge pas", test: c => { const r = PJ.fresh(c); return !!r.stage.querySelector(".ajout") && submitForm(r.stage, ".ajout").defaultPrevented; } }
      ],
      hints: ["`document.querySelector(\".ajout\").addEventListener(\"submit\", (event) => { event.preventDefault(); … });`", "Dans la fonction : `const champNom = document.querySelector(\"#nom-element\");` et `if (champNom.value !== \"\") { … }`.", "Dans le if : `elements.push({ nom: champNom.value, categorie: …, fait: false });` puis `champNom.value = \"\";` puis `afficher(elements);`"],
      check: [{ q: "Dans quel ordre se passent les choses quand on ajoute un élément ?", opts: ["submit → preventDefault → lire le champ → push → afficher()", "afficher() → push → submit", "La page se recharge puis ajoute l’élément"], a: 0, why: "Événement, lecture, données, affichage : le circuit de toute interface." }],
      explain: "Explique le chemin d’un nouvel élément : du champ de texte jusqu’à sa carte sur la page."
    });
  }
  if (type === "boutique") {
    steps.push({
      n: 6, title: "Le panier", notion: "push, splice, totalPrix()", needs: "malin-bouton", diagrams: ["crud", "render"],
      intro: "Ta boutique devient une vraie boutique : on ajoute des produits au panier, on en retire, et le total se calcule avec ta fonction de l’étape 2.",
      instructions: ["Le bloc `.panier-bloc` est déjà dans index.html : la liste `.panier` et le paragraphe `.total`.", "Crée `const panier = [];` (vide au départ).", "Dans `afficher`, ajoute à chaque carte un bouton `.ajouter` : au clic, le produit est ajouté au panier (`push`), puis on appelle `afficherPanier()`.", "Écris `afficherPanier()` : elle vide `.panier`, crée un `li` par produit (« nom · prix € ») avec un bouton `.retirer` (✕) qui enlève ce produit (`splice(index, 1)`) puis réaffiche ; enfin `.total` affiche `Total : 40 €` avec `totalPrix(panier)`."],
      goals: [
        { label: "Chaque carte a un bouton `.ajouter`", test: c => { const r = PJ.fresh(c); const cs = PJ.cards(r.stage); return cs.length > 0 && cs.every(x => x.querySelector(".ajouter")); } },
        { label: "Ajouter deux produits : 2 lignes et le bon total", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const cs = PJ.cards(r.stage); if (cs.length < 2 || !cs[0].querySelector(".ajouter")) return false; if (!r.stage.querySelector(".panier")) return "Il manque `<ul class=\"panier\">` dans index.html."; cs[0].querySelector(".ajouter").click(); cs[1].querySelector(".ajouter").click(); const n = r.stage.querySelectorAll(".panier li").length; if (n !== 2) return n === 3 ? "3 lignes pour 2 produits : vide `.panier` au début d’`afficherPanier`." : false; return near(PJ.num(txt(r.stage, ".total")), d[0].prix + d[1].prix) || "`.total` affiche « " + txt(r.stage, ".total") + " »."; } },
        { label: "Le bouton ✕ (`.retirer`) enlève le produit et met le total à jour", test: c => { const r = PJ.fresh(c), d = V(r, P.data); const cs = PJ.cards(r.stage); if (cs.length < 2) return false; cs[0].querySelector(".ajouter").click(); cs[1].querySelector(".ajouter").click(); const btn = r.stage.querySelector(".panier li .retirer"); if (!btn) return "Chaque ligne du panier doit avoir un bouton `.retirer`."; btn.click(); return r.stage.querySelectorAll(".panier li").length === 1 && near(PJ.num(txt(r.stage, ".total")), d[1].prix); } }
      ],
      hints: ["Dans le `forEach` d’`afficher` : un bouton `ajouter` dont le clic fait `panier.push(produit); afficherPanier();`", "`function afficherPanier() { const liste = document.querySelector(\".panier\"); liste.innerHTML = \"\"; panier.forEach((produit, index) => { … }); }`", "Dans la boucle : un `li`, un bouton `.retirer` qui fait `panier.splice(index, 1); afficherPanier();`. Après la boucle : `document.querySelector(\".total\").textContent = \"Total : \" + totalPrix(panier) + \" €\";`"],
      check: [{ q: "Pourquoi le total se calcule avec `totalPrix(panier)` et pas `totalPrix(produits)` ?", opts: ["On additionne ce qui est dans le panier, pas tout le catalogue : la fonction de l’étape 2 sert avec une autre liste", "Parce que produits est vide", "C’est pareil"], a: 0, why: "C’est tout l’intérêt du paramètre : la même fonction, une autre liste." }, { q: "Comment le bouton ✕ sait-il quel produit retirer ?", opts: ["Il a été créé dans le tour de boucle de ce produit : `index` est la position de ce produit dans le panier", "Il retire toujours le premier", "Il cherche le produit par son nom"], a: 0, why: "`forEach((produit, index) => …)` donne la position à chaque tour." }],
      explain: "Explique ce qui se passe dans les données et sur la page quand on ajoute puis retire un produit."
    });
    steps.push({
      n: 7, title: "La commande", notion: "submit, conditions", needs: "malin-bouton", diagrams: ["form"],
      intro: "Le client passe commande : on vérifie le panier et le prénom avant de confirmer.",
      instructions: ["Le formulaire `.commande` est déjà dans index.html : le champ `#prenom`, puis `.erreur` et `.succes`.", "À l’envoi : empêche le rechargement.", "Si le panier est vide → `.erreur` affiche `Ton panier est vide`. Sinon si le prénom est vide → `Le prénom est obligatoire`.", "Sinon : `.erreur` est vidé et `.succes` affiche `Merci Léa, commande de 2 articles validée !` (prénom et nombre d’articles réels)."],
      goals: [
        { label: "Panier vide : `Ton panier est vide`", test: c => { const r = PJ.fresh(c); if (!r.stage.querySelector(".commande")) return "Il manque le formulaire `.commande` dans index.html."; typeIn(r.stage, "#prenom", "Léa"); submitForm(r.stage, ".commande"); return txt(r.stage, ".erreur") === "Ton panier est vide"; } },
        { label: "Prénom vide : `Le prénom est obligatoire`", test: c => { const r = PJ.fresh(c); const b = r.stage.querySelector(".carte .ajouter"); if (!b) return false; b.click(); submitForm(r.stage, ".commande"); return txt(r.stage, ".erreur") === "Le prénom est obligatoire"; } },
        { label: "Tout est bon : `Merci Léa, commande de 2 articles validée !`", test: c => { const r = PJ.fresh(c); const cs = PJ.cards(r.stage); if (cs.length < 2) return false; cs[0].querySelector(".ajouter").click(); cs[1].querySelector(".ajouter").click(); typeIn(r.stage, "#prenom", "Léa"); submitForm(r.stage, ".commande"); return txt(r.stage, ".succes") === "Merci Léa, commande de 2 articles validée !" && txt(r.stage, ".erreur") === ""; } },
        { label: "La page ne se recharge pas", test: c => { const r = PJ.fresh(c); return !!r.stage.querySelector(".commande") && submitForm(r.stage, ".commande").defaultPrevented; } }
      ],
      hints: ["`document.querySelector(\".commande\").addEventListener(\"submit\", (event) => { event.preventDefault(); … });`", "Le panier vide : `panier.length === 0`. Le prénom : `document.querySelector(\"#prenom\").value`.", "Le succès : `\"Merci \" + prenom + \", commande de \" + panier.length + \" articles validée !\"`"],
      check: [{ q: "Pourquoi tester le panier vide **avant** le prénom ?", opts: ["Le cas le plus bloquant d’abord : sans article, le prénom ne sert à rien", "L’ordre ne compte pas", "Parce que panier vient avant prenom dans l’alphabet"], a: 0, why: "Dans une chaîne de else if, l’ordre des tests est une décision." }],
      explain: "Explique comment ton code décide quel message afficher au moment de la commande."
    });
  }
  return steps;
}

/* ---------- extraire la solution d’une étape (formateur et tests) ---------- */
function solutionAt(src, n, kind) {
  let step = 0; const out = [];
  const tagRe = kind === "html" ? /\s*<!--@(\d+)-->\s*$/ : /\s*\/\/@(\d+)\s*$/;
  for (const line of src.split("\n")) {
    const h = kind === "js" && line.match(/^\/\/ ===== Étape (\d+)/); if (h) step = +h[1];
    const t = line.match(tagRe); const s = t ? +t[1] : (kind === "html" ? 0 : step);
    if (s <= n) out.push(line.replace(tagRe, ""));
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
function htmlPart(src, n) { return src.split("\n").filter(l => new RegExp("<!--@" + n + "-->\\s*$").test(l)).map(l => l.replace(/\s*<!--@\d+-->\s*$/, "")).join("\n").replace(/^(\s*)/gm, m => m.slice(Math.min(m.length, 4))); }
