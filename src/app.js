import express from 'express'
import recettesRoutes from './routes/recettes.routes.js'
import statsRoutes from './routes/stats.routes.js'
import categoriesRoutes from './routes/categories.routes.js'

const app = express()

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenue sur l API de recettes' })
})

app.use('/api/recettes', recettesRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/categories', categoriesRoutes)

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
