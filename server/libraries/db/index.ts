import type { sqlite3 } from 'sqlite3'
import { verbose } from 'sqlite3'
import users from './users.sql'

export const db = async () => {
  const { path } = configs.get('db')
  const sqlite3: sqlite3 = verbose()
  const connector = new sqlite3.Database(path)
  await new Promise(resolve => connector.run(users, resolve))
  return connector
}