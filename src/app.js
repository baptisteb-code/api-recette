import express from 'express'
import recettesRoutes from './routes/recettes.routes.js'

const app = express()

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenue sur l API de recettes' })
})

app.use('/api/recettes', recettesRoutes)

export default app
