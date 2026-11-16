// Seul fichier qui connait l'API TheMealDB
const BASE = 'https://www.themealdb.com/api/json/v1/1'

// Transforme une recette brute de TheMealDB en recette propre
function nettoyer (recette) {
    // Les ingredients arrivent dans 40 champs a plat : strIngredient1..20 et strMeasure1..20
    // On les regroupe dans un tableau, en ignorant les champs vides
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        const nom = recette['strIngredient' + i]
        const quantite = recette['strMeasure' + i]
        if (nom) {
            ingredients.push({ nom: nom, quantite: quantite })
        }
    }

    return {
        id: recette.idMeal,
        nom: recette.strMeal,
        categorie: recette.strCategory,
        pays: recette.strCountry,
        image: recette.strMealThumb,
        ingredients: ingredients,
        nbIngredients: ingredients.length
    }
}

// Liste des recettes qui commencent par la lettre a
export async function chercherRecettes () {
    const response = await fetch(BASE + '/search.php?f=a')
    const donnees = await response.json()
    // meals vaut null quand TheMealDB ne trouve rien
    if (!donnees.meals) {
        return []
    }
    return donnees.meals.map(nettoyer)
}

// Une seule recette, ou null si l'id n'existe pas
export async function chercherRecetteParId (id) {
    const response = await fetch(BASE + '/lookup.php?i=' + id)
    const donnees = await response.json()
    // id inconnu : meals vaut null. id qui n'est pas un nombre : meals vaut 'Invalid ID'
    if (!donnees.meals || donnees.meals === 'Invalid ID') {
        return null
    }
    return nettoyer(donnees.meals[0])
}
