import type { sqlite3 } from 'sqlite3'
import { verbose } from 'sqlite3'
import users from './users.sql'
import barCodes from './barcodes.sql'
import providers from './providers.sql'
import products from './products.sql'

export const db = async () => {
  const { path } = configs.get('db')
  const sqlite3: sqlite3 = verbose()
  const connector = new sqlite3.Database(path)
  await new Promise(resolve => connector.run(users, resolve))
  await new Promise(resolve => connector.run(barCodes, resolve))
  await new Promise(resolve => connector.run(providers, resolve))
  await new Promise(resolve => connector.run(products, resolve))
  return connector
}