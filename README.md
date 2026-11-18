# API Recettes

API REST en **Node.js** et **Express** qui se place entre un front et [TheMealDB](https://www.themealdb.com/api.php).

Elle va chercher les recettes sur TheMealDB, puis :

- **nettoie** la donnée : champs renommés en français, et les 40 champs `strIngredient1..20` / `strMeasure1..20` regroupés dans un seul tableau `ingredients`, sans les champs vides ;
- **filtre** les recettes par catégorie et par pays, et permet de les **chercher par nom** ;
- **pagine** la liste, 20 recettes par page ;
- **calcule** des statistiques qui n'existent pas dans TheMealDB : comptages par catégorie et par pays, ingrédients les plus utilisés.

TheMealDB n'a pas de route « toutes les recettes ». L'API les charge donc lettre par lettre (26 appels, soit environ 790 recettes), puis les garde en **cache en mémoire**. Le premier appel prend quelques secondes, les suivants sont instantanés. Le cache repart de zéro à chaque redémarrage du serveur.

Elle ne renvoie que du JSON. Il n'y a pas de page web. CORS est activé : un site sur une autre origine (par exemple un front Next.js sur `localhost:3001`) peut l'appeler avec `fetch`.

## Lancer le projet

Prérequis : Node.js 20 ou plus.

```bash
git clone https://github.com/baptisteb-code/api-recette.git
cd api-recette
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

- `npm run dev` : `node --watch server.js`, qui redémarre à chaque sauvegarde.
- `npm start` : `node server.js`.

## Les routes

Toutes les routes sont en `GET`.

| Route | Ce qu'elle fait |
|---|---|
| `/api` | Message d'accueil, pour vérifier que le serveur répond |
| `/api/recettes` | Liste des recettes nettoyées, page 1 |
| `/api/recettes?page=2` | Page suivante. Renvoie `404` si la page n'existe pas |
| `/api/recettes?categorie=Dessert` | Filtre par catégorie |
| `/api/recettes?pays=Spain` | Filtre par pays |
| `/api/recettes?nom=chicken` | Recherche : les recettes dont le nom contient le texte, sans tenir compte des majuscules |
| `/api/recettes?nom=chicken&pays=India&page=1` | Les filtres et la page se combinent avec `&` |
| `/api/recettes/:id` | Une seule recette, par exemple `/api/recettes/52772`. Renvoie `404` si l'id n'existe pas |
| `/api/stats` | Statistiques calculées sur toutes les recettes |
| `/api/categories` | Chaque catégorie avec son nombre de recettes, triées de la plus fournie à la moins fournie |
| `/api/pays` | Chaque pays avec son nombre de recettes, triés du plus fourni au moins fourni |
| `/api/ingredients` | Les 20 ingrédients les plus utilisés, triés, avec le nombre de recettes qui les contiennent |
| `/api/ingredients?limite=5` | Pareil, mais seulement les 5 premiers |

La liste renvoie toujours la même forme. On filtre d'abord, on pagine ensuite : `total` est donc le nombre de recettes qui correspondent aux filtres.

```json
{
  "page": 1,
  "nbPages": 40,
  "total": 790,
  "recettes": [ "... 20 recettes nettoyées ..." ]
}
```

Une URL qui ne correspond à aucune route renvoie `404` avec `{ "erreur": "Route inconnue : ..." }`.
Une erreur dans le code renvoie `500` avec `{ "erreur": "Erreur du serveur" }`.

### Exemple : une recette nettoyée

`GET /api/recettes/52772`

```json
{
  "id": "52772",
  "nom": "Teriyaki Chicken Casserole",
  "categorie": "Chicken",
  "pays": "Japan",
  "image": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "ingredients": [
    { "nom": "soy sauce", "quantite": "3/4 cup" },
    { "nom": "water", "quantite": "1/2 cup" },
    { "nom": "brown sugar", "quantite": "1/4 cup" }
  ],
  "nbIngredients": 9
}
```

### Exemple : les statistiques

`GET /api/stats`

```json
{
  "total": 790,
  "nbDesserts": 167,
  "categorieLaPlusFrequente": "Dessert",
  "recetteAvecLePlusDIngredients": { "nom": "Battenberg Cake", "nbIngredients": 20 },
  "parCategorie": { "Seafood": 84, "Dessert": 167, "...": "..." },
  "parPays": { "Spain": 48, "...": "..." }
}
```

### Exemple : les catégories

`GET /api/categories`

```json
{
  "total": 14,
  "categories": [
    { "nom": "Dessert", "nbRecettes": 167 },
    { "nom": "Vegetarian", "nbRecettes": 100 },
    { "nom": "Beef", "nbRecettes": 95 }
  ]
}
```

`/api/pays` renvoie la même forme, avec une clé `pays` à la place de `categories`.

### Exemple : les ingrédients les plus utilisés

`GET /api/ingredients?limite=3`

```json
{
  "totalIngredientsDifferents": 946,
  "ingredients": [
    { "nom": "salt", "nbRecettes": 325 },
    { "nom": "garlic", "nbRecettes": 248 },
    { "nom": "onion", "nbRecettes": 227 }
  ]
}
```

Les noms sont comptés en minuscules : `Garlic` et `garlic` sont le même ingrédient.

## Organisation des fichiers

```
api-recette/
├── server.js                         # allume le serveur sur le port 3000
├── package.json
├── .gitignore
└── src/
    ├── app.js                        # crée l'app, active CORS, branche les routes, gère 404 et 500
    ├── routes/
    │   ├── recettes.routes.js        # tout ce qui commence par /api/recettes
    │   ├── stats.routes.js           # tout ce qui commence par /api/stats
    │   ├── categories.routes.js      # tout ce qui commence par /api/categories
    │   ├── pays.routes.js            # tout ce qui commence par /api/pays
    │   └── ingredients.routes.js     # tout ce qui commence par /api/ingredients
    └── services/
        └── themealdb.service.js      # seul fichier qui appelle TheMealDB et nettoie la donnée
```

## Ce qui est fait

**Le socle demandé**

- [x] Une liste : les recettes nettoyées (`/api/recettes`)
- [x] Un élément : une recette par id, avec un vrai 404 (`/api/recettes/:id`)
- [x] Un filtre : par catégorie et par pays (`?categorie=`, `?pays=`)
- [x] Des statistiques calculées (`/api/stats`)
- [x] Architecture en dossiers, routes inconnues en 404 et erreurs en 500

**Pour aller plus loin**

- [x] Toutes les recettes de TheMealDB, avec un cache en mémoire
- [x] Pagination (`?page=`)
- [x] Recherche par nom (`?nom=`), combinable avec les filtres
- [x] Catégories avec leur nombre de recettes (`/api/categories`)
- [x] Pays avec leur nombre de recettes (`/api/pays`)
- [x] Ingrédients les plus utilisés, triés (`/api/ingredients`)
- [x] CORS, pour pouvoir appeler l'API depuis un site
