import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'

const router = Router()

// GET /api/pays
// Chaque pays avec son nombre de recettes, du plus fourni au moins fourni
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    // On compte : { 'United Kingdom': 80, Spain: 48, ... }
    const compteur = {}
    for (const recette of recettes) {
        if (compteur[recette.pays]) {
            compteur[recette.pays] = compteur[recette.pays] + 1
        } else {
            compteur[recette.pays] = 1
        }
    }

    // Object.entries donne des paires [nom, nombre], qu'on transforme en objets propres
    const pays = Object.entries(compteur).map(([nom, nombre]) => ({
        nom: nom,
        nbRecettes: nombre
    }))

    // Tri : le pays qui a le plus de recettes en premier
    pays.sort((a, b) => b.nbRecettes - a.nbRecettes)

    res.json({
        total: pays.length,
        pays: pays
    })
})

export default router
