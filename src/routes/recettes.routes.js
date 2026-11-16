import { Router } from 'express'
import { chercherRecettes, chercherRecetteParId } from '../services/themealdb.service.js'

const router = Router()

// GET /api/recettes
// Filtres possibles : ?categorie=Dessert  ?pays=Spain  (combinables avec &)
router.get('/', async (req, res) => {
    let recettes = await chercherRecettes()
    if (req.query.categorie) {
        recettes = recettes.filter((r) => r.categorie === req.query.categorie)
    }
    if (req.query.pays) {
        recettes = recettes.filter((r) => r.pays === req.query.pays)
    }
    res.json(recettes)
})

// GET /api/recettes/:id
router.get('/:id', async (req, res) => {
    const recette = await chercherRecetteParId(req.params.id)
    if (!recette) {
        return res.status(404).json({ erreur: 'Recette introuvable' })
    }
    res.json(recette)
})

export default router
