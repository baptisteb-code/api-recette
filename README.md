# API Recettes

API REST en **Node.js** et **Express** qui se place entre un front et [TheMealDB](https://www.themealdb.com/api.php).

Elle va chercher les recettes sur TheMealDB, puis :

- **nettoie** la donnée : champs renommés en français, et les 40 champs `strIngredient1..20` / `strMeasure1..20` regroupés dans un seul tableau `ingredients`, sans les champs vides ;
- **filtre** les recettes par catégorie et par pays ;
- **calcule** des statistiques qui n'existent pas dans TheMealDB.

Elle ne renvoie que du JSON. Il n'y a pas de page web.

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
| `/api/recettes` | Liste des recettes nettoyées |
| `/api/recettes?categorie=Dessert` | Filtre par catégorie |
| `/api/recettes?pays=Spain` | Filtre par pays |
| `/api/recettes?categorie=Side&pays=Algeria` | Les filtres se combinent avec `&` |
| `/api/recettes/:id` | Une seule recette, par exemple `/api/recettes/52772`. Renvoie `404` si l'id n'existe pas |
| `/api/stats` | Statistiques calculées par l'API |

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
  "total": 40,
  "nbDesserts": 14,
  "categorieLaPlusFrequente": "Dessert",
  "recetteAvecLePlusDIngredients": { "nom": "...", "nbIngredients": 18 },
  "parCategorie": { "Dessert": 14, "Side": 6, "...": "..." },
  "parPays": { "Spain": 4, "Turkey": 4, "...": "..." }
}
```

## Organisation des fichiers

```
api-recette/
├── server.js                         # allume le serveur sur le port 3000
├── package.json
├── .gitignore
└── src/
    ├── app.js                        # crée l'app, branche les routes, gère 404 et 500
    ├── routes/
    │   ├── recettes.routes.js        # tout ce qui commence par /api/recettes
    │   └── stats.routes.js           # tout ce qui commence par /api/stats
    └── services/
        └── themealdb.service.js      # seul fichier qui appelle TheMealDB et nettoie la donnée
```

## Avancement

- [x] Liste des recettes nettoyées
- [x] Une recette par id, avec un vrai 404
- [x] Filtres par catégorie et par pays
- [x] Statistiques calculées
- [x] Gestion des routes inconnues (404) et des erreurs (500)
- [ ] Toutes les recettes de TheMealDB (pour l'instant, seulement celles qui commencent par « a »), avec un cache
- [ ] Pagination
- [ ] Recherche par nom
- [ ] Catégories avec leur nombre de recettes
- [ ] Ingrédients les plus utilisés
- [ ] CORS, pour pouvoir appeler l'API depuis un site
