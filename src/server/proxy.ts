import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173'],
  }),
)

const googleMapsProxy = createProxyMiddleware({
  target: 'https://maps.googleapis.com',
  changeOrigin: true,
  pathRewrite: (path: string) => {
    const url = new URL(path.replace(/^\/api\/google/, ''), 'https://maps.googleapis.com')
    url.searchParams.append('key', process.env.VITE_GOOGLE_MAPS_API_KEY || '')
    return url.pathname + url.search
  },
})

app.use('/api/google', googleMapsProxy)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`)
})
