# javascript_avance

**Bip Agence** : un jeu pour apprendre le JavaScript en comprenant ce qu'on fait, pas en copiant-collant.

L'élève est stagiaire dans une agence web. Bip, le robot de l'agence, lui confie des missions pour de vrais types de clients : site vitrine, appli, boutique, formulaire… Chaque notion est montrée là où on la retrouve sur le web, avec le « pourquoi » avant le « comment ».

Suite de [javascript_game](https://github.com/Diurndesign/javascript_game) (Mission Bip).

## Lancer le jeu

Ouvrir `index.html` dans un navigateur. Rien à installer.
Pour le mettre en ligne : GitHub Pages (Settings › Pages › branche `main`).

## Ce qu'il y a dedans

- **47 missions** réparties chez 11 clients : variables, types, tableaux, objets, fonctions, conditions, boucles, `forEach`, `filter`, DOM, événements, formulaires, création d'éléments.
- **Deux formations** pour les points qui bloquent :
  - *Le chemin des données* : comment on va chercher, modifier ou supprimer une information dans un tableau d'objets (`projets[2].titre`, `length - 1`, `splice`…).
  - *Les accolades* : à quoi sert chaque `{ }`, où elles commencent, où elles finissent.
- **Des schémas** pour chaque notion, rangés dans le Carnet.
- **Un éditeur qui aide** : les paires d'accolades et de parenthèses ont la même couleur, les erreurs sont expliquées en français avec la ligne concernée, et le mode **Pas à pas** montre la mémoire ligne par ligne.
- **Pas de copier-coller** dans l'éditeur : le code se tape, et les questions de compréhension se valident avec ses propres mots.

## Et après ?

À la fin des 47 missions, le jeu envoie vers le **site Valmont** (cours de la séance 07) : les mêmes notions, appliquées à un vrai site.

## Pour le formateur

Carnet › Options › **Mode formateur** (code : `itecom`). Il débloque toutes les missions et donne accès aux solutions.

La progression est enregistrée dans le navigateur de l'élève (`localStorage`).

## Les fichiers

```
index.html
css/style.css
js/missions.js            les clients et les missions
js/missions-formation.js  les deux formations et leurs missions
js/schemas.js             les schémas du Carnet
js/moteur.js              le moteur du jeu (éditeur, exécution, vérifications)
```
