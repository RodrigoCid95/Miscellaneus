import { type Database } from "sqlite3"

export class ProvidersModel {
  @Library('db') private db: Database
  public async getAll(): Promise<Miscellaneous.Provider[]> {
    const results = await new Promise<Miscellaneous.ProviderResult[]>(resolve => {
      this.db.all<Miscellaneous.ProviderResult>('SELECT rowid, * FROM providers', (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
    const barCodes: Miscellaneous.Provider[] = []
    for (const { rowid, name, phone } of results) {
      barCodes.push({
        id: rowid,
        name,
        phone
      })
    }
    return barCodes
  }
  public async get(id: Miscellaneous.Provider['id']): Promise<Miscellaneous.Provider | null> {
    if (isNaN(id)) {
      return null
    }
    return new Promise<Miscellaneous.Provider | null>(resolve => {
      this.db.get<Miscellaneous.ProviderResult>('SELECT rowid, * FROM providers WHERE rowid = ?', [id], (err, row) => {
        if (err) {
          console.log(err)
          resolve(null)
        } else {
          if (row) {
            resolve({
              id: row.rowid,
              name: row.name,
              phone: row.phone
            })
          } else {
            resolve(null)
          }
        }
      })
    })
  }
  public async create({ name, phone }: Miscellaneous.NewProvider): Promise<void> {
    await new Promise<void>(resolve => {
      this.db.run('INSERT INTO providers (name, phone) VALUES (?, ?)', [name, phone], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
  public async update(id: Miscellaneous.Provider['id'], { name, phone }: Miscellaneous.NewProvider): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('UPDATE providers SET name = ?, phone = ? WHERE rowid = ?', [name, phone, id], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
  public async delete(id: Miscellaneous.Provider['id']): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('DELETE FROM providers WHERE rowid = ?', [id], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
}