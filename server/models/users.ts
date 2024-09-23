import type { Database } from "sqlite3"
import crypto from 'node:crypto'

export class UsersModel {
  @Library('db') private db: Database
  public async getAll(): Promise<Miscellaneous.User[]> {
    const results = await new Promise<Miscellaneous.UserResult[]>(resolve => {
      this.db.all<Miscellaneous.UserResult>('SELECT rowid, * FROM users', (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
    const users: Miscellaneous.User[] = []
    for (const { rowid, name, user_name, is_admin } of results) {
      users.push({
        id: rowid,
        name,
        userName: user_name,
        isAdmin: is_admin === 1
      })
    }
    return users
  }
  public async get(name: Miscellaneous.User['userName']): Promise<Miscellaneous.UserResult | null> {
    return new Promise<Miscellaneous.UserResult | null>(resolve => {
      this.db.get<Miscellaneous.UserResult>('SELECT rowid, * FROM users WHERE user_name = ?', [name], (err, row) => {
        if (err) {
          console.error(err)
          resolve(null)
        } else {
          resolve(row || null)
        }
      })
    })
  }
  public generateHash = (password: string): string => crypto.createHash('sha256').update(password).digest('hex')
  public async create(user: Miscellaneous.NewUser): Promise<void> {
    const { name, userName, password, isAdmin } = user
    const hash = this.generateHash(password)
    await new Promise<void>(resolve => {
      this.db.run('INSERT INTO users (name, user_name, hash, is_admin) VALUES (?, ?, ?, ?)', [name, userName, hash, isAdmin ? 1 : 0], (err) => {
        if (err) {
          console.error(err)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
  public async update(user: Partial<Miscellaneous.User>, id: Miscellaneous.User['id']): Promise<void> {
    const { name, userName, isAdmin } = user
    await new Promise<void>(resolve => {
      this.db.run('UPDATE users SET name = ?, user_name = ?, is_admin = ? WHERE rowid = ?', [name, userName, isAdmin ? 1 : 0, id], (err) => {
        if (err) {
          console.error(err)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
  public async delete(id: Miscellaneous.User['id']): Promise<void> {
    await new Promise<void>(resolve => {
      this.db.run('DELETE FROM users WHERE rowid = ?', [id], (err) => {
        if (err) {
          console.error(err)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
  public async updatePassword(newPassword: string, id: Miscellaneous.User['id']): Promise<void> {
    const newHash = this.generateHash(newPassword)
    await new Promise<void>(resolve => {
      this.db.run('UPDATE users SET hash = ? WHERE rowid = ?', [newHash, id], (err) => {
        if (err) {
          console.error(err)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }
}