import express from 'express'

const app = express()

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenue sur l API de recettes' })
})

export default app
