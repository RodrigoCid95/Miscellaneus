import { type Database } from "sqlite3"

export class BarCodesModel {
  @Library('db') private db: Database
  public async getAll(): Promise<Miscellaneous.BarCode[]> {
    const results = await new Promise<Miscellaneous.BarCodeResult[]>(resolve => {
      this.db.all<Miscellaneous.BarCodeResult>('SELECT rowid, * FROM bar_codes', (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
    const barCodes: Miscellaneous.BarCode[] = []
    for (const { rowid, name, tag, value } of results) {
      barCodes.push({
        id: rowid,
        name,
        tag,
        value
      })
    }
    return barCodes
  }
  public async get(id: Miscellaneous.BarCode['id']): Promise<Miscellaneous.BarCode | null> {
    if (isNaN(id)) {
      return null
    }
    return new Promise<Miscellaneous.BarCode | null>(resolve => {
      this.db.get<Miscellaneous.BarCodeResult>('SELECT rowid, * FROM bar_codes WHERE rowid = ?', [id], (err, row) => {
        if (err) {
          console.log(err)
          resolve(null)
        } else {
          if (row) {
            resolve({
              id: row.rowid,
              name: row.name,
              tag: row.tag,
              value: row.value
            })
          } else {
            resolve(null)
          }
        }
      })
    })
  }
  public async create({ name, tag, value }: Miscellaneous.NewBarCode): Promise<void> {
    await new Promise<void>(resolve => {
      this.db.run('INSERT INTO bar_codes (name, tag, value) VALUES (?, ?, ?)', [name, tag || '', value], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
  public async update(id: Miscellaneous.BarCode['id'], { name, tag, value }: Miscellaneous.NewBarCode): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('UPDATE bar_codes SET name = ?, tag = ?, value = ? WHERE rowid = ?', [name, tag || '', value, id], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
  public async delete(id: Miscellaneous.BarCode['id']): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('DELETE FROM bar_codes WHERE rowid = ?', [id], (err) => {
        if (err) {
          console.log(err)
        }
        resolve()
      })
    })
  }
}