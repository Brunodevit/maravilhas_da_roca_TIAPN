import mysql, { Pool } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let pool: Pool

export const initPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }

  return pool
}

// cria o pool imediatamente
export default initPool()