import { Router } from 'express'
import { chercherRecettes, chercherRecetteParId } from '../services/themealdb.service.js'

const router = Router()

const PAR_PAGE = 20

// GET /api/recettes
// Filtres possibles : ?categorie=Dessert  ?pays=Spain  ?nom=chicken  (combinables avec &)
// Pagination : ?page=2
router.get('/', async (req, res) => {
    let recettes = await chercherRecettes()
    if (req.query.categorie) {
        recettes = recettes.filter((r) => r.categorie === req.query.categorie)
    }
    if (req.query.pays) {
        recettes = recettes.filter((r) => r.pays === req.query.pays)
    }
    // Recherche : garde les recettes dont le nom contient le texte, sans tenir compte des majuscules
    if (req.query.nom) {
        recettes = recettes.filter((r) => r.nom.toLowerCase().includes(req.query.nom.toLowerCase()))
    }

    // On filtre d'abord, on pagine ensuite : sinon le total est faux
    const total = recettes.length
    const nbPages = Math.ceil(total / PAR_PAGE)
    const page = Number(req.query.page) || 1
    if (page < 1 || (nbPages > 0 && page > nbPages)) {
        return res.status(404).json({ erreur: 'Cette page n existe pas' })
    }
    const debut = (page - 1) * PAR_PAGE
    res.json({ page, nbPages, total, recettes: recettes.slice(debut, debut + PAR_PAGE) })
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
