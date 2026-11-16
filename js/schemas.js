"use strict";
/* =====================================================================
   SCHÉMAS : chaque notion dessinée en HTML/CSS (s’adapte au mobile)
   ===================================================================== */
const DC = s => `<span class="dg-code">${highlight(s)}</span>`;           // code sur fond encre
const DV = s => `<span class="dg-mono">${esc(s)}</span>`;                  // code sur fond clair
const AR = (label, dir) => `<span class="dg-arrow">${dir === "l" ? "← " : ""}${label ? `<small>${esc(label)}</small>` : ""}${dir === "l" ? "" : " →"}</span>`;
const BOX = (name, inner) => `<span class="dg-boxv"><span class="dg-boxname">${esc(name)}</span><span class="dg-boxin">${inner}</span></span>`;

const DIAGRAMS = {
  variable: () => ({
    title: "Une variable = une boîte avec un nom",
    html: `<div class="dg-row dg-wrap">
      <div class="dg-col">${DC("let prix = 1.2;")}<div class="dg-row"><span class="dg-val">1.2</span>${AR("range dans")}${BOX("prix", "1.2")}</div><small class="dg-step">1. créer</small></div>
      <div class="dg-col">${DC("prix = 1.3;")}<div class="dg-row"><span class="dg-val">1.3</span>${AR("remplace")}${BOX("prix", "<s>1.2</s> 1.3")}</div><small class="dg-step">2. modifier (sans let)</small></div>
      <div class="dg-col">${DC("console.log(prix);")}<div class="dg-row">${BOX("prix", "1.3")}${AR("on lit")}<span class="dg-console">› 1.3</span></div><small class="dg-step">3. lire (le nom seul)</small></div>
    </div>`,
    caption: "Une boîte ne contient qu’**une** valeur à la fois. `let` crée la boîte une seule fois ; ensuite on utilise juste son nom."
  }),
  types: () => ({
    title: "Les trois types de base",
    html: `<div class="dg-grid3">
      <div class="dg-type" style="--c:var(--t-str)"><b>string · texte</b>${DC("\"Bip\"")}${DC("\"42\"")}<small>toujours entre guillemets</small></div>
      <div class="dg-type" style="--c:var(--t-num)"><b>number · nombre</b>${DC("42")}${DC("1.2")}<small>sans guillemets, point pour les décimales</small></div>
      <div class="dg-type" style="--c:var(--t-bool)"><b>boolean · vrai/faux</b>${DC("true")}${DC("false")}<small>seulement ces deux valeurs</small></div>
    </div>`,
    caption: "Les guillemets changent le type : `\"42\"` est un texte. Résultat : `\"5\" + 1` colle et donne `\"51\"`."
  }),
  reassign: () => ({
    title: "total = total + 25 : lire, calculer, ranger",
    html: `<div class="dg-row dg-wrap">${DC("total = total + 25;")}</div>
      <div class="dg-row dg-wrap dg-steps"><div class="dg-card"><b>1. Lire</b><p>la boîte <code>total</code> → 0</p></div>${AR("")}<div class="dg-card"><b>2. Calculer</b><p>0 + 25 = 25</p></div>${AR("")}<div class="dg-card dg-hl"><b>3. Ranger</b><p>25 dans <code>total</code></p></div></div>`,
    caption: "JavaScript calcule toujours **la droite du =** d’abord, puis range le résultat à gauche. C’est pour ça qu’une variable peut grandir."
  }),
  concat: () => ({
    title: "Coller du texte avec +",
    html: `<div class="dg-row dg-wrap"><span class="dg-piece">"Bonjour "</span><b class="dg-plus">+</b><span class="dg-piece dg-var">nom<small>contient "Léa"</small></span><b class="dg-plus">+</b><span class="dg-piece">" !"</span>${AR("donne")}<span class="dg-console">› Bonjour Léa !</span></div>`,
    caption: "Les espaces sont **dans** les guillemets. Sans eux, on obtient « BonjourLéa! »."
  }),
  array: () => ({
    title: "Un tableau : on numérote à partir de 0, on compte à partir de 1",
    html: `<div class="dg-array">
      ${["Intro", "Soleil", "Nuit", "Bonus"].map((v, i) => `<div class="dg-cell ${i === 3 ? "dg-last" : ""}"><span class="dg-idx">[${i}]</span><span class="dg-cv">"${v}"</span>${i === 0 ? `<span class="dg-tag">premier : [0]</span>` : ""}${i === 3 ? `<span class="dg-tag">dernier : [length - 1]</span>` : ""}</div>`).join("")}
      <div class="dg-cell dg-ghost"><span class="dg-idx">[4]</span><span class="dg-cv">rien</span><span class="dg-tag dg-tag-ko">[length] = undefined</span></div>
      <div class="dg-brace"><span><b>length = 4</b> : on compte 1, 2, 3, 4</span></div>
    </div>`,
    caption: "Les numéros (index) vont de **0 à 3**, le compte (length) vaut **4**. Le dernier numéro est donc toujours `length - 1`. Comme les étages : rez-de-chaussée = 0, un immeuble de 4 niveaux a son dernier étage au 3."
  }),
  object: () => ({
    title: "Un objet : une fiche avec des étiquettes",
    html: `<div class="dg-row dg-wrap">
      <div class="dg-obj"><div class="dg-objhead">photo <small>{ … }</small></div>
        <div class="dg-objrow"><span class="dg-key">titre</span><span>${fmtHTML("Port de Nice")}</span></div>
        <div class="dg-objrow dg-hl"><span class="dg-key">likes</span><span>${fmtHTML(120)}</span></div>
        <div class="dg-objrow"><span class="dg-key">annee</span><span>${fmtHTML(2024)}</span></div></div>
      <div class="dg-col">${DC("photo.likes")}<small class="dg-step"><b>photo</b> : la fiche</small><small class="dg-step"><b>.likes</b> : l’étiquette à lire → 120</small>${DC("photo.likes = 121;")}<small class="dg-step">même chemin + <b>=</b> : on modifie</small></div>
    </div>`,
    caption: "Dans le code, un objet s’écrit `{ etiquette: valeur, … }`. Le **point** ouvre la fiche et lit une étiquette."
  }),
  path: () => ({
    title: "Le chemin vers une donnée : de gauche à droite, un morceau à la fois",
    html: `<div class="dg-row dg-wrap">${DC("boutique.rayons[1].produits[0].prix")}</div>
      <div class="dg-path">
        ${[["boutique", "un objet : la boutique", "{ }"], [".rayons", "un tableau de rayons", "[ ]"], ["[1]", "le 2e rayon : un objet", "{ }"], [".produits", "un tableau de produits", "[ ]"], ["[0]", "le 1er produit : un objet", "{ }"], [".prix", "la valeur : 1.2", "1.2"]]
          .map(([c, d, k], i) => `${i ? `<span class="dg-arrow">→</span>` : ""}<div class="dg-pstep"><span class="dg-n">${i + 1}</span>${DC(c)}<small>${esc(d)}</small><span class="dg-kind">${esc(k)}</span></div>`).join("")}
      </div>`,
    caption: "Après un **objet** `{ }`, on continue avec un point : `.etiquette`. Après un **tableau** `[ ]`, on continue avec un crochet : `[numéro]`. Pour savoir lequel écrire, regarde ce que tu as obtenu juste avant."
  }),
  crud: () => ({
    title: "Récupérer, ajouter, modifier, supprimer",
    html: `<div class="dg-tablewrap"><table class="dg-table"><thead><tr><th></th><th>Récupérer</th><th>Ajouter</th><th>Modifier</th><th>Supprimer</th></tr></thead><tbody>
      <tr><th>Tableau <small>[ ]</small></th><td>${DV("liste[0]")}</td><td>${DV("liste.push(x)")}</td><td>${DV("liste[0] = x")}</td><td>${DV("liste.splice(i, 1)")}<br>${DV("liste.filter(…)")}</td></tr>
      <tr><th>Objet <small>{ }</small></th><td>${DV("fiche.nom")}</td><td>${DV("fiche.neuf = x")}</td><td>${DV("fiche.nom = x")}</td><td>${DV("delete fiche.nom")}</td></tr>
      <tr><th>Page <small>DOM</small></th><td>${DV("document.querySelector(…)")}</td><td>${DV("parent.appendChild(el)")}</td><td>${DV("el.textContent = x")}<br>${DV("el.classList.add(…)")}</td><td>${DV("el.remove()")}</td></tr>
    </tbody></table></div>`,
    caption: "Toujours la même logique : **d’abord le chemin** jusqu’à la donnée, **ensuite l’action**. Pour modifier ou supprimer quelque chose, il faut d’abord savoir le récupérer."
  }),
  function: () => ({
    title: "Une fonction : aller, calcul, retour",
    html: `<div class="dg-row dg-wrap">
      <div class="dg-col">${DC("calculerTTC(20)")}<small class="dg-step">1. l’appel envoie 20</small></div>
      ${AR("aller")}
      <div class="dg-obj dg-machine"><div class="dg-objhead">function calculerTTC(prixHT)</div>
        <div class="dg-objrow"><span class="dg-key">entrée</span><span>prixHT = 20</span></div>
        <div class="dg-objrow"><span class="dg-key">calcul</span><span>taxe = 2</span></div>
        <div class="dg-objrow dg-hl"><span class="dg-key">sortie</span><span>return 22</span></div></div>
      ${AR("retour")}
      <div class="dg-col">${BOX("plat", "22")}<small class="dg-step">3. le résultat est rangé</small></div>
    </div>`,
    caption: "Écrire la fonction la **range**. L’**appel** la lance : les valeurs entrent par les paramètres, le résultat sort par `return` et revient à l’endroit de l’appel."
  }),
  returnlog: () => ({
    title: "return ou console.log ?",
    html: `<div class="dg-grid2"><div class="dg-card dg-hl"><b>return</b><p>renvoie la valeur au code qui a appelé la fonction. On peut la ranger : <code>const a = double(5);</code> → <code>a</code> vaut 10.</p></div><div class="dg-card"><b>console.log</b><p>affiche pour le développeur, c’est tout. Si la fonction n’a pas de <code>return</code>, elle renvoie <code>undefined</code>.</p></div></div>`,
    caption: "Une fonction qui calcule doit **renvoyer**. Afficher, c’est le travail de celui qui l’appelle."
  }),
  if: () => ({
    title: "if / else : un aiguillage",
    html: `<div class="dg-fork"><div class="dg-cond">${DC("if (temperature < 10)")}<small>la condition donne true ou false</small></div>
      <div class="dg-branches"><div class="dg-branch dg-yes"><b>true</b>${DC("{ conseil = \"Manteau\"; }")}</div><div class="dg-branch dg-no"><b>false</b>${DC("else { conseil = \"Pull\"; }")}</div></div>
      <div class="dg-join">puis la suite du programme : <b>un seul</b> des deux blocs a été exécuté</div></div>`,
    caption: "Le code entre `{` et `}` ne s’exécute que si on prend ce chemin. Le pas à pas te montre `true` ou `false` à chaque test."
  }),
  elseif: () => ({
    title: "else if : on teste dans l’ordre, on s’arrête au premier vrai",
    html: `<div class="dg-ladder"><p class="dg-step">Avec <code>vent = 45</code> :</p>
      <div class="dg-lrow dg-skip">${DC("if (vent > 80)")}<span>false → test suivant</span></div>
      <div class="dg-lrow dg-hit">${DC("else if (vent > 40)")}<span>true → « Vent fort », <b>on s’arrête ici</b></span></div>
      <div class="dg-lrow dg-never">${DC("else if (vent > 20)")}<span>jamais testé (pourtant 45 > 20)</span></div>
      <div class="dg-lrow dg-never">${DC("else")}<span>jamais exécuté</span></div></div>`,
    caption: "L’**ordre** des tests compte : mets le cas le plus précis en premier."
  }),
  "blocks-if": () => ({
    title: "Les accolades dessinent des boîtes",
    html: `<div class="dg-grid2">
      <div><p class="dg-step"><b class="ok">Bien rangé</b> : deux boîtes séparées</p><div class="dg-blocks">
        <div class="dg-blk b0"><span class="dg-c">if (age &lt; 18) <i>{</i></span><div class="dg-line"><span class="dg-c">prix = 6;</span></div><span class="dg-c"><i>}</i></span></div>
        <div class="dg-blk b0"><span class="dg-c">if (membre) <i>{</i></span><div class="dg-line"><span class="dg-c">prix = prix - 2;</span></div><span class="dg-c"><i>}</i></span></div>
        <div class="dg-line dg-out"><span class="dg-c">console.log(prix);</span><small>hors des boîtes : toujours exécuté</small></div></div></div>
      <div><p class="dg-step"><b class="ko">Mal rangé</b> : la 2e boîte est enfermée dans la 1re</p><div class="dg-blocks">
        <div class="dg-blk b0"><span class="dg-c">if (age &lt; 18) <i>{</i></span><div class="dg-line"><span class="dg-c">prix = 6;</span></div>
          <div class="dg-blk b1"><span class="dg-c">if (membre) <i>{</i></span><div class="dg-line"><span class="dg-c">prix = prix - 2;</span></div><div class="dg-line"><span class="dg-c">console.log(prix);</span></div><span class="dg-c"><i>}</i></span></div>
        <span class="dg-c"><i>}</i></span><small>les adultes ne passent jamais par ici</small></div></div></div>
    </div>`,
    caption: "Une `{` ouvre une boîte, la `}` correspondante la ferme. Une ligne ne s’exécute que si **toutes** les boîtes qui l’entourent s’ouvrent. Décale de 2 espaces tout ce qui est dans une boîte : la structure se voit d’un coup d’œil."
  }),
  blocks: () => ({
    title: "Lire les accolades : chaque { a sa } de la même couleur",
    html: `<div class="dg-blocks">
      <div class="dg-blk b0"><span class="dg-c">function compter(liste) <i>{</i></span>
        <div class="dg-blk b1"><span class="dg-c">liste.forEach((note) =&gt; <i>{</i></span>
          <div class="dg-blk b2"><span class="dg-c">if (note &gt;= 10) <i>{</i></span>
            <div class="dg-line"><span class="dg-c">reussies = reussies + 1;</span><small>dans le if, dans la boucle, dans la fonction</small></div>
          <span class="dg-c"><i>}</i></span><small>ferme le if</small></div>
        <span class="dg-c"><i>}</i>);</span><small><b>}</b> ferme la fonction fléchée, <b>)</b> ferme <code>forEach(</code></small></div>
        <div class="dg-line"><span class="dg-c">console.log(reussies);</span><small>après la boucle : une seule fois</small></div>
      <span class="dg-c"><i>}</i></span><small>ferme la fonction</small></div></div>
      <div class="dg-grid2"><div class="dg-card"><b>{ } = bloc de code</b><p>après <code>if (…)</code>, <code>else</code>, <code>function nom(…)</code> ou <code>=&gt;</code>. Dedans : des instructions, une par ligne.</p></div><div class="dg-card"><b>{ } = objet</b><p>après <code>=</code>, dans <code>[ ]</code> ou dans <code>( )</code>. Dedans : des étiquettes <code>nom: valeur</code> séparées par des virgules.</p></div></div>`,
    caption: "Dans l’éditeur du jeu, une accolade et sa partenaire ont la **même couleur**. Clique juste à côté d’une accolade : sa partenaire s’allume."
  }),
  foreach: () => ({
    title: "forEach : la même fonction, un tour par élément",
    html: `<div class="dg-row dg-wrap"><div class="dg-cells-mini"><span>"Intro"</span><span>"Soleil"</span><span>"Nuit"</span></div>${AR("un par un")}
      <div class="dg-obj dg-machine"><div class="dg-objhead">(titre) =&gt; { … }</div>
        <div class="dg-objrow"><span class="dg-key">tour 1</span><span>titre = "Intro"</span></div>
        <div class="dg-objrow"><span class="dg-key">tour 2</span><span>titre = "Soleil"</span></div>
        <div class="dg-objrow"><span class="dg-key">tour 3</span><span>titre = "Nuit"</span></div></div>
      ${AR("fini")}<span class="dg-note">ligne après <code>});</code> : une seule fois</span></div>`,
    caption: "Ce qui est **entre les accolades** de la boucle se répète. Ce qui est **après** `});` s’exécute une fois, quand tous les tours sont finis."
  }),
  filter: () => ({
    title: "filter : un nouveau tableau avec ceux qui passent le test",
    html: `<div class="dg-row dg-wrap"><div class="dg-col"><small class="dg-step">photos (3)</small><div class="dg-cells-mini"><span>Port · 120</span><span>Mont · 40</span><span>Plage · 300</span></div></div>${AR("")}
      <div class="dg-cond">${DC("photo.likes > 100")}<small>testé pour chaque photo</small></div>${AR("")}
      <div class="dg-col"><small class="dg-step">populaires (2) : un nouveau tableau</small><div class="dg-cells-mini"><span class="ok">Port</span><span class="ok">Plage</span></div><small class="ko">Mont : false, pas gardée</small></div></div>`,
    caption: "`photos` n’est **pas** modifié : il contient toujours 3 photos. Pour « supprimer » avec filter, on garde tout **sauf** l’élément à enlever, et on range le résultat."
  }),
  dom: () => ({
    title: "Le DOM : la page vue comme un arbre",
    html: `<div class="dg-row dg-wrap dg-top"><div class="dg-tree"><span class="dg-node">document</span><ul><li><span class="dg-node">div.profil</span><ul><li><span class="dg-node">div.avatar</span></li><li><span class="dg-node dg-hl">h2.pseudo</span></li><li><span class="dg-node">p.bio</span></li></ul></li></ul></div>
      <div class="dg-col">${DC("const titre = document.querySelector(\".pseudo\");")}<small class="dg-step">1. <b>récupérer</b> : cherche dans l’arbre le 1er élément qui a la classe pseudo</small>${DC("titre.textContent = \"@lea\";")}<small class="dg-step">2. <b>modifier</b> son texte</small>${DC("titre.remove();")}<small class="dg-step">3. <b>supprimer</b> : l’enlever de la page</small></div></div>`,
    caption: "On ne modifie jamais « la page » d’un coup : on **attrape** d’abord un élément (querySelector), puis on agit **sur lui**."
  }),
  event: () => ({
    title: "Les deux temps d’un programme web",
    html: `<div class="dg-timeline"><div class="dg-tl"><b>1. Au chargement</b><p>Les lignes s’exécutent de haut en bas. <code>addEventListener</code> <strong>branche</strong> l’écouteur, puis on passe à la suite.</p></div><div class="dg-tl dg-wait"><b>… le visiteur lit, tape …</b><p>Le code ne fait rien : il attend.</p></div><div class="dg-tl dg-ev"><b>2. Clic ! (ou submit, input…)</b><p>Le navigateur lance la fonction de l’écouteur. À <strong>chaque</strong> événement, elle repart du début.</p></div></div>`,
    caption: "Ce qui doit se souvenir entre deux clics (un compteur) se crée **avant**, au chargement. Ce qui dépend du visiteur (ce qu’il a tapé) se lit **dans** la fonction."
  }),
  form: () => ({
    title: "Le trajet d’un formulaire",
    html: `<div class="dg-row dg-wrap dg-flow"><span class="dg-chip">le visiteur tape</span>${AR("")}<span class="dg-chip">Entrée ou bouton</span>${AR("")}<span class="dg-chip dg-hl">événement "submit"</span>${AR("")}${DC("event.preventDefault()")}${AR("")}${DC("champ.value")}${AR("")}${DC("if (…)")}${AR("")}${DC("message.textContent = …")}</div>`,
    caption: "Sans `preventDefault`, le navigateur recharge la page et tout est effacé. `.value` donne le texte tapé **au moment** où on le lit."
  }),
  create: () => ({
    title: "Créer un élément : fabriquer, remplir, accrocher",
    html: `<div class="dg-grid3"><div class="dg-card"><b>1. Fabriquer</b>${DV("document.createElement(\"li\")")}<div class="dg-mem">&lt;li&gt;&lt;/li&gt;</div><small>en mémoire, <b>pas</b> sur la page</small></div><div class="dg-card"><b>2. Remplir</b>${DV("li.textContent = \"Pain\"")}<div class="dg-mem">&lt;li&gt;Pain&lt;/li&gt;</div><small>toujours invisible</small></div><div class="dg-card dg-hl"><b>3. Accrocher</b>${DV("liste.appendChild(li)")}<div class="dg-page">ul.liste<br>└ li « Pain »</div><small>dans la page : visible !</small></div></div>`,
    caption: "Sans l’étape 3, l’élément existe mais personne ne le voit. Pour le supprimer ensuite : `li.remove()`."
  }),
  render: () => ({
    title: "Données → afficher() → page",
    html: `<div class="dg-row dg-wrap"><div class="dg-col"><small class="dg-step">les données</small>${DC("courses = [\"Pain\", \"Lait\"]")}</div>${AR("")}
      <div class="dg-obj dg-machine"><div class="dg-objhead">function afficher()</div><div class="dg-objrow"><span class="dg-key">1</span><span>vider : <code>ul.innerHTML = ""</code></span></div><div class="dg-objrow"><span class="dg-key">2</span><span>pour chaque donnée : créer, remplir, accrocher</span></div></div>${AR("")}
      <div class="dg-col"><small class="dg-step">la page</small><div class="dg-page">• Pain<br>• Lait</div></div></div>`,
    caption: "Ajouter, modifier ou supprimer = on change **le tableau**, puis on rappelle `afficher()`. La page suit toujours les données."
  })
};
const DIAGRAM_ORDER = ["variable", "types", "reassign", "concat", "if", "elseif", "blocks-if", "array", "foreach", "object", "path", "filter", "crud", "function", "returnlog", "blocks", "dom", "event", "form", "create", "render"];
function diagramHTML(key) {
  const f = DIAGRAMS[key]; if (!f) return "";
  const d = f();
  return `<figure class="dg"><p class="dg-title">${esc(d.title)}</p><div class="dg-body">${d.html}</div>${d.caption ? `<figcaption>${md(d.caption)}</figcaption>` : ""}</figure>`;
}
