"use strict";
/* =====================================================================
   PROJETS CLÉS EN MAIN : HTML et CSS fournis, les élèves codent le JS
   ===================================================================== */

const BRAND_LUNE = {
  brand: "Atelier Lune", slogan: "Illustration et graphisme à Nice",
  fonts: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Syne:wght@700;800&display=swap",
  categories: ["Affiches", "Logos", "Illustrations"],
  client: "Atelier Lune est un petit studio niçois d’illustration et de graphisme. Il veut un site vitrine pour montrer ses travaux : une galerie filtrable, un bouton J’aime sur chaque projet, un mode sombre et un formulaire de contact.",
  content: [
    { titre: "Festival Lueurs", categorie: "Affiches", annee: 2026, description: "Affiche du festival de lumières de Nice" },
    { titre: "Ferme des Collines", categorie: "Logos", annee: 2025, description: "Identité d'une ferme bio de l'arrière-pays" },
    { titre: "La baie la nuit", categorie: "Illustrations", annee: 2026, description: "Série d'illustrations sur la baie des Anges" },
    { titre: "Nuit du jazz", categorie: "Affiches", annee: 2024, description: "Affiche d'un concert au théâtre de verdure" },
    { titre: "Allô Robinet", categorie: "Logos", annee: 2026, description: "Logo d'un plombier niçois" },
    { titre: "Marché aux fleurs", categorie: "Illustrations", annee: 2025, description: "Illustration du cours Saleya" }
  ],
  html: `<div class="app">
  <header class="barre">
    <span class="logo">☾ Lune</span>
    <nav class="menu">
      <a href="#travaux">Travaux</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="theme">Mode sombre</button>
  </header>

  <section class="entete">
    <p class="surtitre">Studio d’illustration · Nice</p>
    <h1 class="titre">Nom du studio</h1>
    <p class="slogan">Le slogan apparaîtra ici</p>
    <p class="nb-favoris">0 favori</p>
  </section>

  <section class="travaux" id="travaux">
    <div class="travaux-tete">
      <h2>Travaux récents</h2>
      <nav class="filtres">
        <button class="filtre">Tout</button>
        <button class="filtre">Affiches</button>
        <button class="filtre">Logos</button>
        <button class="filtre">Illustrations</button>
      </nav>
    </div>
    <main class="grille"></main>
  </section>

  <section class="contact-bloc" id="contact">
    <div>
      <h2>Un projet ?</h2>
      <p>Affiche, logo, illustration : parlons-en.</p>
    </div>
    <form class="contact">
      <label for="nom">Nom</label>
      <input id="nom" type="text">
      <label for="email">E-mail</label>
      <input id="email" type="text">
      <label for="message">Message</label>
      <textarea id="message" rows="3"></textarea>
      <button type="submit">Envoyer</button>
      <p class="erreur"></p>
      <p class="succes"></p>
    </form>
  </section>

  <footer class="pied">
    <p>Atelier Lune · Site réalisé en HTML, CSS et JavaScript</p>
  </footer>
</div>`,
  css: `/* ===== Atelier Lune · style fourni ===== */

/* 1. Les réglages : couleurs et polices (bonus : change-les à la fin pour ton portfolio) */
.app {
  --fond: #F4F1EC;
  --texte: #1F1D2B;
  --doux: #6E6A7C;
  --accent: #5B4BDB;
  --accent-2: #F2B84B;
  --carte: #FFFFFF;
  --ligne: #E2DDD5;
  --police-titre: "Syne", "Arial Black", sans-serif;
  --police-texte: "Manrope", Arial, sans-serif;
}
.app.sombre {
  --fond: #14131C;
  --texte: #F2EFEA;
  --doux: #A5A1B5;
  --carte: #1F1E2A;
  --ligne: #34324A;
}

/* 2. La page, mobile d'abord */
* { box-sizing: border-box; }
body { margin: 0; }
.app {
  container-type: inline-size;
  min-height: 100vh;
  background: var(--fond);
  color: var(--texte);
  font-family: var(--police-texte);
  line-height: 1.5;
  transition: background .3s, color .3s;
}
.barre { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-bottom: 1px solid var(--ligne); }
.logo { font: 800 1.3rem var(--police-titre); color: var(--accent); }
.menu { display: flex; gap: 14px; margin-left: auto; }
.menu a { color: var(--texte); text-decoration: none; font-weight: 600; font-size: .9rem; }
.theme { border: 1px solid var(--texte); background: transparent; color: var(--texte); border-radius: 999px; padding: 6px 12px; font: 600 .8rem var(--police-texte); cursor: pointer; white-space: nowrap; }

.entete { padding: 48px 18px 32px; display: grid; gap: 10px; }
.surtitre { margin: 0; font-size: .75rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 800; color: var(--accent); }
.titre { margin: 0; font: 800 clamp(2.6rem, 13cqi, 6.5rem)/.95 var(--police-titre); letter-spacing: -.03em; }
.slogan { margin: 0; font-size: 1.1rem; color: var(--doux); max-width: 32ch; }
.nb-favoris { justify-self: start; margin: 8px 0 0; background: var(--accent-2); color: #1F1D2B; font-weight: 800; font-size: .85rem; border-radius: 999px; padding: 4px 12px; }

.travaux { padding: 0 18px 40px; display: grid; gap: 18px; }
.travaux-tete { display: grid; gap: 12px; }
.travaux h2, .contact-bloc h2 { margin: 0; font: 800 1.6rem var(--police-titre); }
.filtres { display: flex; flex-wrap: wrap; gap: 8px; }
.filtre { border: 1px solid var(--ligne); background: var(--carte); color: var(--texte); border-radius: 999px; padding: 7px 14px; font: 600 .85rem var(--police-texte); cursor: pointer; }
.filtre:hover, .filtre:focus { border-color: var(--accent); color: var(--accent); }

.grille { display: grid; gap: 16px; }
.carte { background: var(--carte); border: 1px solid var(--ligne); border-radius: 18px; overflow: hidden; display: grid; gap: 6px; padding: 0 16px 16px; align-content: start; }
.carte::before { content: ""; display: block; height: 170px; margin: 0 -16px 10px; background: linear-gradient(135deg, #5B4BDB, #9C8CFF); }
.carte:nth-child(3n+2)::before { background: linear-gradient(135deg, #F2B84B, #F27B4B); }
.carte:nth-child(3n+3)::before { background: radial-gradient(circle at 32% 42%, #F4F1EC 0 16%, #1F1D2B 17%); }
.carte h2 { margin: 0; font: 800 1.15rem var(--police-titre); }
.carte p { margin: 0; color: var(--doux); font-size: .92rem; }
.carte button { justify-self: start; margin-top: 6px; border: 1px solid var(--ligne); border-radius: 999px; padding: 7px 14px; background: var(--fond); color: var(--texte); font: 700 .85rem var(--police-texte); cursor: pointer; }
.carte.aime { outline: 3px solid var(--accent); }
.carte.aime button { background: var(--accent); border-color: var(--accent); color: #fff; }

.contact-bloc { margin: 0 18px 40px; padding: 24px; border-radius: 24px; background: var(--texte); color: var(--fond); display: grid; gap: 18px; }
.contact-bloc p { margin: 6px 0 0; opacity: .8; }
.contact { display: grid; gap: 8px; }
.contact label { font-weight: 700; font-size: .85rem; }
.contact input, .contact textarea { font: inherit; padding: 10px 12px; border: 0; border-radius: 12px; background: var(--fond); color: var(--texte); }
.contact button { justify-self: start; border: 0; border-radius: 999px; padding: 10px 18px; background: var(--accent-2); color: #1F1D2B; font: 800 .95rem var(--police-texte); cursor: pointer; }
.erreur { margin: 0; color: #FF8A80; font-weight: 700; }
.succes { margin: 0; color: #8FE3A8; font-weight: 700; }
.pied { padding: 20px 18px 32px; color: var(--doux); font-size: .85rem; border-top: 1px solid var(--ligne); }
.pied p { margin: 0; }

/* 3. Version ordinateur : quand la page fait plus de 700 px */
@container (min-width: 700px) {
  .barre, .entete, .travaux, .pied { padding-left: 48px; padding-right: 48px; }
  .entete { padding-top: 80px; padding-bottom: 56px; }
  .travaux-tete { grid-template-columns: 1fr auto; align-items: end; }
  .grille { grid-template-columns: repeat(3, 1fr); }
  .contact-bloc { margin: 0 48px 56px; padding: 40px; grid-template-columns: 1fr 1.2fr; align-items: start; }
}
`
};

const BRAND_PAS = {
  brand: "Petits pas", slogan: "Une habitude à la fois",
  fonts: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap",
  categories: ["Santé", "Créativité", "Lecture"],
  client: "Petits pas est une start-up qui imagine une appli mobile de suivi d’habitudes. Elle veut un prototype qui marche : une liste à cocher, une progression, des filtres, la possibilité d’ajouter et de supprimer des habitudes, et un mode sombre.",
  content: [
    { nom: "Boire 1,5 L d'eau", categorie: "Santé", fait: true },
    { nom: "10 min de marche", categorie: "Santé", fait: false },
    { nom: "Dessiner 15 min", categorie: "Créativité", fait: false },
    { nom: "Noter 3 idées", categorie: "Créativité", fait: true },
    { nom: "Lire 20 pages", categorie: "Lecture", fait: false },
    { nom: "Finir un chapitre", categorie: "Lecture", fait: false }
  ],
  html: `<div class="app">
  <div class="page">
    <aside class="presentation">
      <p class="surtitre">Appli de suivi d’habitudes</p>
      <h2>Un petit pas par jour.</h2>
      <p>Coche tes habitudes, suis ta progression, ajoute tes propres défis. Pensée pour le téléphone.</p>
    </aside>

    <div class="ecran">
      <header class="entete">
        <div>
          <p class="bonjour">Bonjour !</p>
          <h1 class="titre">Nom de l’appli</h1>
          <p class="slogan">Le slogan apparaîtra ici</p>
        </div>
        <button class="theme">Mode sombre</button>
      </header>

      <div class="score">
        <small>Aujourd’hui</small>
        <p class="progression">0 / 0 faits</p>
      </div>

      <nav class="filtres">
        <button class="filtre">Tout</button>
        <button class="filtre">Santé</button>
        <button class="filtre">Créativité</button>
        <button class="filtre">Lecture</button>
      </nav>

      <main class="grille"></main>

      <form class="ajout">
        <h2>Nouvelle habitude</h2>
        <input id="nom-element" type="text" placeholder="Ex : Méditer 5 min">
        <input id="categorie-element" type="text" placeholder="Catégorie : Santé, Créativité ou Lecture">
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </div>
</div>`,
  css: `/* ===== Petits pas · style fourni ===== */

/* 1. Les réglages : couleurs et police (bonus : change-les à la fin pour ton portfolio) */
.app {
  --fond: #E9F3EE;
  --ecran: #FFFFFF;
  --texte: #15352F;
  --doux: #5D7A72;
  --accent: #FF7A59;
  --vert: #2FA36B;
  --jaune: #FFD45C;
  --ligne: #D5E6DD;
  --police: "Nunito", Arial, sans-serif;
}
.app.sombre {
  --fond: #0F1F1B;
  --ecran: #17302A;
  --texte: #E6F2EC;
  --doux: #9DBAB1;
  --ligne: #24443B;
}

/* 2. L'appli, mobile d'abord */
* { box-sizing: border-box; }
body { margin: 0; }
.app {
  container-type: inline-size;
  min-height: 100vh;
  background: var(--fond);
  color: var(--texte);
  font-family: var(--police);
  transition: background .3s, color .3s;
}
.presentation { display: none; }
.ecran { background: var(--ecran); min-height: 100vh; padding: 22px 16px 28px; display: grid; gap: 16px; align-content: start; transition: background .3s; }
.entete { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.bonjour { margin: 0; color: var(--doux); font-weight: 800; }
.titre { margin: 2px 0 0; font: 900 2.1rem/1.05 var(--police); letter-spacing: -.02em; }
.slogan { margin: 4px 0 0; color: var(--doux); }
.theme { border: 0; background: var(--fond); color: var(--texte); border-radius: 999px; padding: 8px 12px; font: 800 .75rem var(--police); cursor: pointer; white-space: nowrap; }

.score { background: var(--texte); color: var(--ecran); border-radius: 24px; padding: 18px 20px; display: grid; gap: 2px; }
.score small { opacity: .75; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: .7rem; }
.progression { margin: 0; font: 900 2.2rem var(--police); color: var(--jaune); }

.filtres { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
.filtre { flex: none; border: 2px solid var(--ligne); background: transparent; color: var(--texte); border-radius: 999px; padding: 7px 14px; font: 800 .85rem var(--police); cursor: pointer; }
.filtre:hover, .filtre:focus { border-color: var(--texte); }

.grille { display: grid; gap: 10px; }
.carte { display: grid; grid-template-columns: 1fr auto auto; align-items: center; column-gap: 8px; row-gap: 2px; background: var(--fond); border-radius: 18px; padding: 14px 12px 14px 16px; border-left: 6px solid var(--accent); }
.carte:nth-child(3n+2) { border-left-color: var(--vert); }
.carte:nth-child(3n) { border-left-color: var(--jaune); }
.carte h2, .carte p { grid-column: 1; margin: 0; }
.carte h2 { grid-row: 1; font: 800 1.05rem var(--police); }
.carte p { grid-row: 2; color: var(--doux); font-size: .82rem; font-weight: 700; }
.carte button { grid-row: 1 / span 2; grid-column: 2; border: 0; border-radius: 12px; padding: 9px 10px; font: 800 .78rem var(--police); cursor: pointer; background: var(--vert); color: #fff; }
.carte button + button { grid-column: 3; }
.carte .supprimer { background: transparent; color: var(--doux); border: 2px solid var(--ligne); }
.carte.fait { opacity: .6; }
.carte.fait h2 { text-decoration: line-through; }
.carte.fait .cocher { background: var(--ligne); color: var(--texte); }

.ajout { display: grid; gap: 8px; background: var(--fond); border-radius: 20px; padding: 16px; }
.ajout h2 { margin: 0; font: 900 1.1rem var(--police); }
.ajout input { font: inherit; padding: 11px 12px; border: 2px solid var(--ligne); border-radius: 12px; background: var(--ecran); color: var(--texte); }
.ajout button { border: 0; border-radius: 14px; padding: 12px; background: var(--accent); color: #fff; font: 900 1rem var(--police); cursor: pointer; }

/* 3. Version ordinateur : l'appli dans un téléphone, la présentation à côté */
@container (min-width: 700px) {
  .page { display: grid; grid-template-columns: 1fr 400px; gap: 56px; align-items: center; padding: 48px 56px; min-height: 100vh; }
  .presentation { display: grid; gap: 14px; align-content: center; }
  .presentation h2 { margin: 0; font: 900 3.6rem/1 var(--police); letter-spacing: -.03em; }
  .presentation p { margin: 0; color: var(--doux); font-size: 1.15rem; max-width: 34ch; }
  .surtitre { margin: 0; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: .1em; font-size: .8rem; }
  .ecran { min-height: 0; max-height: 760px; overflow: auto; border-radius: 40px; border: 10px solid var(--texte); box-shadow: 0 30px 60px rgba(21, 53, 47, .2); }
}
`
};

const BRAND_ENCRE = {
  brand: "Encre & Papier", slogan: "Affiches et papeterie imprimées à Nice",
  fonts: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap",
  categories: ["Affiches", "Papeterie", "Accessoires"],
  client: "Encre & Papier est un atelier d’impression niçois qui vend ses affiches et sa papeterie. Il veut une boutique en ligne : un catalogue filtrable, un panier qui calcule le total, la possibilité de retirer un article, un mode sombre et un formulaire de commande.",
  content: [
    { nom: "Affiche Baie des Anges", prix: 25, categorie: "Affiches" },
    { nom: "Affiche Vieux-Nice", prix: 30, categorie: "Affiches" },
    { nom: "Carnet ligné", prix: 12, categorie: "Papeterie" },
    { nom: "Cartes postales x5", prix: 8, categorie: "Papeterie" },
    { nom: "Tote bag", prix: 15, categorie: "Accessoires" },
    { nom: "Badge", prix: 3, categorie: "Accessoires" }
  ],
  html: `<div class="app">
  <header class="barre">
    <span class="logo">E&amp;P</span>
    <p class="info">Imprimé à Nice · expédié en 48 h</p>
    <button class="theme">Mode sombre</button>
  </header>

  <section class="entete">
    <h1 class="titre">Nom de la boutique</h1>
    <p class="slogan">Le slogan apparaîtra ici</p>
  </section>

  <div class="boutique">
    <section class="catalogue">
      <nav class="filtres">
        <button class="filtre">Tout</button>
        <button class="filtre">Affiches</button>
        <button class="filtre">Papeterie</button>
        <button class="filtre">Accessoires</button>
      </nav>
      <main class="grille"></main>
    </section>

    <aside class="panier-bloc">
      <h2>Mon panier</h2>
      <ul class="panier"></ul>
      <p class="total">Total : 0 €</p>
      <form class="commande">
        <label for="prenom">Prénom</label>
        <input id="prenom" type="text">
        <button type="submit">Commander</button>
        <p class="erreur"></p>
        <p class="succes"></p>
      </form>
    </aside>
  </div>

  <footer class="pied">
    <p>Encre &amp; Papier · Boutique réalisée en HTML, CSS et JavaScript</p>
  </footer>
</div>`,
  css: `/* ===== Encre & Papier · style fourni ===== */

/* 1. Les réglages : couleurs et polices (bonus : change-les à la fin pour ton portfolio) */
.app {
  --fond: #F6F1E9;
  --papier: #FFFFFF;
  --texte: #161616;
  --doux: #6B655C;
  --accent: #E23D28;
  --kraft: #D9C4A1;
  --ligne: #E3DACB;
  --police-titre: "DM Serif Display", Georgia, serif;
  --police-texte: "DM Sans", Arial, sans-serif;
}
.app.sombre {
  --fond: #141210;
  --papier: #1F1C19;
  --texte: #F3EDE4;
  --doux: #ADA597;
  --ligne: #39342E;
}

/* 2. La boutique, mobile d'abord */
* { box-sizing: border-box; }
body { margin: 0; }
.app {
  container-type: inline-size;
  min-height: 100vh;
  background: var(--fond);
  color: var(--texte);
  font-family: var(--police-texte);
  transition: background .3s, color .3s;
}
.barre { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--texte); color: var(--fond); }
.logo { font: 400 1.5rem var(--police-titre); }
.info { margin: 0 auto 0 0; font-size: .78rem; opacity: .8; }
.theme { border: 1px solid currentColor; background: transparent; color: inherit; border-radius: 999px; padding: 6px 12px; font: 600 .78rem var(--police-texte); cursor: pointer; white-space: nowrap; }

.entete { padding: 36px 16px 24px; display: grid; gap: 8px; border-bottom: 2px solid var(--texte); }
.titre { margin: 0; font: 400 clamp(2.6rem, 12cqi, 6rem)/.95 var(--police-titre); }
.slogan { margin: 0; color: var(--doux); font-size: 1.05rem; }

.boutique { display: grid; gap: 24px; padding: 20px 16px 40px; }
.catalogue { display: grid; gap: 16px; align-content: start; }
.filtres { display: flex; flex-wrap: wrap; gap: 6px; }
.filtre { border: 2px solid var(--texte); background: transparent; color: var(--texte); padding: 6px 12px; font: 700 .78rem var(--police-texte); cursor: pointer; text-transform: uppercase; letter-spacing: .05em; }
.filtre:hover, .filtre:focus { background: var(--texte); color: var(--fond); }

.grille { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.carte { background: var(--papier); border: 2px solid var(--texte); display: grid; gap: 4px; padding: 0 12px 12px; align-content: start; }
.carte::before { content: ""; height: 140px; margin: 0 -12px 10px; border-bottom: 2px solid var(--texte); background: var(--kraft) repeating-linear-gradient(45deg, transparent 0 12px, rgba(0, 0, 0, .06) 12px 24px); }
.carte:nth-child(4n+2)::before { background-color: #9DB7C7; }
.carte:nth-child(4n+3)::before { background-color: #E8B04B; }
.carte:nth-child(4n+4)::before { background-color: #E9806E; }
.carte h2 { margin: 0; font: 400 1.15rem/1.15 var(--police-titre); }
.carte p { margin: 0; color: var(--doux); font-size: .82rem; }
.carte p:first-of-type { color: var(--texte); font-weight: 700; font-size: 1rem; }
.carte button { margin-top: 6px; border: 0; background: var(--texte); color: var(--fond); padding: 9px 10px; font: 700 .78rem var(--police-texte); cursor: pointer; }
.carte button:hover { background: var(--accent); color: #fff; }

.panier-bloc { background: var(--papier); border: 2px solid var(--texte); padding: 16px; display: grid; gap: 10px; align-content: start; }
.panier-bloc h2 { margin: 0; font: 400 1.6rem var(--police-titre); }
.panier { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.panier:empty::before { content: "Ton panier est vide pour l’instant."; color: var(--doux); font-size: .9rem; }
.panier li { display: flex; justify-content: space-between; align-items: center; gap: 8px; border-bottom: 1px dashed var(--ligne); padding-bottom: 6px; font-size: .9rem; }
.retirer { border: 0; background: transparent; color: var(--accent); font-weight: 700; cursor: pointer; }
.total { margin: 0; font: 400 1.4rem var(--police-titre); }
.commande { display: grid; gap: 8px; border-top: 2px solid var(--texte); padding-top: 12px; }
.commande label { font-weight: 700; font-size: .85rem; }
.commande input { font: inherit; padding: 10px; border: 2px solid var(--texte); background: var(--fond); color: var(--texte); }
.commande button { border: 0; background: var(--accent); color: #fff; padding: 12px; font: 700 .95rem var(--police-texte); cursor: pointer; }
.erreur { margin: 0; color: var(--accent); font-weight: 700; }
.succes { margin: 0; color: #2E8B57; font-weight: 700; }
.pied { padding: 20px 16px; border-top: 2px solid var(--texte); color: var(--doux); font-size: .85rem; }
.pied p { margin: 0; }

/* 3. Version ordinateur : le catalogue à gauche, le panier à droite */
@container (min-width: 700px) {
  .barre, .entete, .pied { padding-left: 40px; padding-right: 40px; }
  .boutique { grid-template-columns: 1fr 320px; padding: 32px 40px 56px; align-items: start; }
  .grille { grid-template-columns: repeat(3, 1fr); }
  .panier-bloc { position: sticky; top: 20px; }
}
`
};

/* les marques complètent les 3 types de projets */
[["site", BRAND_LUNE], ["appli", BRAND_PAS], ["boutique", BRAND_ENCRE]].forEach(([k, B]) => {
  const P = PROJECT_TYPES[k];
  Object.assign(P, { brand: B.brand, brandSlogan: B.slogan, fonts: B.fonts, categories: B.categories, client: B.client, content: B.content, html: B.html, css: B.css });
  P.kind = P.label; P.label = B.brand;
  P.short = B.slogan; P.pitch = B.client;
  const ex = B.content[0];
  P.example = "{ " + Object.entries(ex).map(([kk, v]) => kk + ": " + JSON.stringify(v)).join(", ") + " }";
  const toObj = it => "{ " + Object.entries(it).map(([kk, v]) => kk + ": " + JSON.stringify(v)).join(", ") + " }";
  const data = "const " + P.data + " = [\n" + B.content.map(it => "  " + toObj(it)).join(",\n") + "\n];";
  P.js = P.js.replace(/const nomProjet = "[^"]*";\nconst slogan = "[^"]*";\n(?:const|let) \w+ = \[[\s\S]*?\n\];/, "const nomProjet = " + JSON.stringify(B.brand) + ";\nconst slogan = " + JSON.stringify(B.slogan) + ";\n" + (k === "appli" ? data.replace(/^const/, "let") : data));
});
