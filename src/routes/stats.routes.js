import { Router } from 'express'
import { chercherRecettes } from '../services/themealdb.service.js'

const router = Router()

// GET /api/stats
// Aucun de ces chiffres n'existe dans TheMealDB : c'est notre code qui les calcule
router.get('/', async (req, res) => {
    const recettes = await chercherRecettes()

    // Nombre de recettes par categorie et par pays
    const parCategorie = {}
    const parPays = {}
    for (const recette of recettes) {
        if (parCategorie[recette.categorie]) {
            parCategorie[recette.categorie] = parCategorie[recette.categorie] + 1
        } else {
            parCategorie[recette.categorie] = 1
        }
        if (parPays[recette.pays]) {
            parPays[recette.pays] = parPays[recette.pays] + 1
        } else {
            parPays[recette.pays] = 1
        }
    }

    // La categorie la plus frequente : on parcourt les paires [categorie, nombre]
    let categorieLaPlusFrequente = null
    let maximum = 0
    for (const [categorie, nombre] of Object.entries(parCategorie)) {
        if (nombre > maximum) {
            maximum = nombre
            categorieLaPlusFrequente = categorie
        }
    }

    // La recette qui demande le plus d'ingredients
    let recetteLaPlusLongue = null
    for (const recette of recettes) {
        if (!recetteLaPlusLongue || recette.nbIngredients > recetteLaPlusLongue.nbIngredients) {
            recetteLaPlusLongue = recette
        }
    }

    res.json({
        total: recettes.length,
        nbDesserts: recettes.filter((r) => r.categorie === 'Dessert').length,
        categorieLaPlusFrequente: categorieLaPlusFrequente,
        recetteAvecLePlusDIngredients: {
            nom: recetteLaPlusLongue.nom,
            nbIngredients: recetteLaPlusLongue.nbIngredients
        },
        parCategorie: parCategorie,
        parPays: parPays
    })
})

export default router
