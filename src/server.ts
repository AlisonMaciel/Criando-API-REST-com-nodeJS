import { app } from './app.ts'
import { env } from './env/index.ts'

const PORT = env.PORT || process.env.PORT || 3333

const numberPort = Number(PORT)

app
  .listen({
    port: numberPort,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running')
  })
