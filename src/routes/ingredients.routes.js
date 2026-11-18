import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'

const router = Router()

// GET /api/ingredients
// Les ingredients les plus utilises, tries du plus frequent au moins frequent
// Option : ?limite=5 pour n'en garder que 5 (20 par defaut)
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    // On compte dans combien de recettes apparait chaque ingredient
    // En minuscules : 'Garlic' et 'garlic' sont le meme ingredient
    const compteur = {}
    for (const recette of recettes) {
        for (const ingredient of recette.ingredients) {
            const nom = ingredient.nom.toLowerCase()
            if (compteur[nom]) {
                compteur[nom] = compteur[nom] + 1
            } else {
                compteur[nom] = 1
            }
        }
    }

    // Object.entries donne des paires [nom, nombre], qu'on transforme en objets propres
    const ingredients = Object.entries(compteur).map(([nom, nombre]) => ({
        nom: nom,
        nbRecettes: nombre
    }))

    // Tri : l'ingredient le plus utilise en premier
    ingredients.sort((a, b) => b.nbRecettes - a.nbRecettes)

    const limite = Number(req.query.limite) || 20

    res.json({
        totalIngredientsDifferents: ingredients.length,
        ingredients: ingredients.slice(0, limite)
    })
})

export default router
