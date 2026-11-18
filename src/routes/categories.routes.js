import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'

const router = Router()

// GET /api/categories
// Chaque categorie avec son nombre de recettes, de la plus fournie a la moins fournie
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    // On compte : { Dessert: 167, Seafood: 84, ... }
    const compteur = {}
    for (const recette of recettes) {
        if (compteur[recette.categorie]) {
            compteur[recette.categorie] = compteur[recette.categorie] + 1
        } else {
            compteur[recette.categorie] = 1
        }
    }

    // Object.entries donne des paires [nom, nombre], qu'on transforme en objets propres
    const categories = Object.entries(compteur).map(([nom, nombre]) => ({
        nom: nom,
        nbRecettes: nombre
    }))

    // Tri : la categorie qui a le plus de recettes en premier
    categories.sort((a, b) => b.nbRecettes - a.nbRecettes)

    res.json({
        total: categories.length,
        categories: categories
    })
})

export default router
