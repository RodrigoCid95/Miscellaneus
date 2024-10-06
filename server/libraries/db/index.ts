import type { sqlite3 } from 'sqlite3'
import { verbose } from 'sqlite3'
import config from './config.sql'
import users from './users.sql'
import barCodes from './barcodes.sql'
import providers from './providers.sql'
import products from './products.sql'
import sales from './sales.sql'

export const db = async () => {
  const { path } = configs.get('db')
  const sqlite3: sqlite3 = verbose()
  const connector = new sqlite3.Database(path)
  await new Promise(resolve => connector.run(config, resolve))
  await new Promise(resolve => connector.run(users, resolve))
  await new Promise(resolve => connector.run(barCodes, resolve))
  await new Promise(resolve => connector.run(providers, resolve))
  await new Promise(resolve => connector.run(products, resolve))
  await new Promise(resolve => connector.run(sales, resolve))
  const results = await new Promise<Miscellaneous.UserResult[]>(resolve => connector.all<Miscellaneous.UserResult>('SELECT * FROM users', (_, rows) => resolve(rows)))
  if (results.length === 0) {
    await new Promise<void>(resolve => connector.run('INSERT INTO users (name, user_name, hash, is_admin) VALUES (?, ?, ?, ?)', ['Admin', 'admin', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1], resolve))
    await new Promise<void>(resolve => connector.run('INSERT INTO config (key, value) VALUES (?, ?);', ['name', 'Miscellaneous'], resolve))
    await new Promise<void>(resolve => connector.run('INSERT INTO config (key, value) VALUES (?, ?);', ['ip_printer', '0.0.0.0'], resolve))
  }
  return connector
}