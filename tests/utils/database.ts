// utils/database.ts

import { Client } from 'pg'

export async function executeQuery(query: string) {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  })

  if (!['dev', 'test', 'ext-test'].includes(process.env.ENVIRONMENT!)) {
    await client.connect()

    const result = await client.query(query)

    await client.end()

    return result.rows
  }
}
