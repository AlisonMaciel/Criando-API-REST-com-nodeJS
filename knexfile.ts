import 'dotenv/config'
import type { Knex } from 'knex'
import { env } from './src/env/index.ts'

const knexConfig: { [env: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: { filename: env.DATABASE_URL },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './tmp/migrations',
    },
  },
}

export default knexConfig
