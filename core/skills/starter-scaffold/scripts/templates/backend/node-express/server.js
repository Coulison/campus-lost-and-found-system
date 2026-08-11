import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req, res) => {
  res.send('__PROJECT_NAME__ API is running.')
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`__PROJECT_NAME__ server listening on http://localhost:${PORT}`)
})
