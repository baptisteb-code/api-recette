import express from 'express'
import cors from 'cors'
import recettesRoutes from './routes/recettes.routes.js'
import statsRoutes from './routes/stats.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import paysRoutes from './routes/pays.routes.js'
import ingredientsRoutes from './routes/ingredients.routes.js'

const app = express()

// Autorise un site sur une autre origine (ex : Next.js sur localhost:3001) a lire nos reponses
// A declarer AVANT les routes
app.use(cors())

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenue sur l API de recettes' })
})

app.use('/api/recettes', recettesRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/pays', paysRoutes)
app.use('/api/ingredients', ingredientsRoutes)

// Aucune route ne correspond
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route inconnue : ' + req.originalUrl })
})

// Quelque chose a casse
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ erreur: 'Erreur du serveur' })
})

export default app
