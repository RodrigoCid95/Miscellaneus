import { type Database } from "sqlite3";

export class HistoryModel {
  @Library('db') private db: Database

  public async findRange(start: number, end: number, uid?: Miscellaneous.User['id']): Promise<Miscellaneous.SaleResult[]> {
    const params = [start, end]
    if (uid) {
      params.unshift(uid)
    }
    return await new Promise<Miscellaneous.SaleResult[]>(resolve => {
      this.db.all<Miscellaneous.SaleResult>(`SELECT rowid, * FROM sales WHERE${uid ? ' id_user = ? AND' : ''} date BETWEEN ? AND ?`, params, (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
  }
  public findByID(id: Miscellaneous.Sale['id']): Promise<Miscellaneous.SaleResult | null> {
    return new Promise<Miscellaneous.SaleResult | null>(resolve => {
      this.db.get<Miscellaneous.SaleResult>('SELECT rowid, * FROM sales WHERE rowid = ?', [id], (err, rows) => {
        if (err) {
          console.error(err)
          resolve(null)
        } else {
          resolve(rows)
        }
      })
    })
  }
  public delete(id: Miscellaneous.Sale['id']): Promise<void> {
    return new Promise<void>(resolve => {
      this.db.run('DELETE FROM sales WHERE rowid = ?', [id], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
}