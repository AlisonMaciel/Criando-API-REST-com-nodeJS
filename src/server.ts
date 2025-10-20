import { app } from './app.ts'

const port = process.env.PORT || 3333

const numberPort = Number(port)

app
  .listen({
    port: numberPort,
  })
  .then(() => {
    console.log('Server is running')
  })
