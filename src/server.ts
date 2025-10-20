import { app } from './app.ts'
import { env } from './env/index.ts'

const PORT = env.PORT || process.env.PORT || 3333

const numberPort = Number(PORT)

app
  .listen({
    port: numberPort,
  })
  .then(() => {
    console.log('Server is running')
  })
