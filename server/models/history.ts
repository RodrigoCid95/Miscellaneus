import { type Database } from "sqlite3";

export class HistoryModel {
  @Library('db') private db: Database

  public async findRange(start: number, end: number): Promise<Miscellaneous.SaleResult[]> {
    return await new Promise<Miscellaneous.SaleResult[]>(resolve => {
      this.db.all<Miscellaneous.SaleResult>('SELECT rowid, * FROM sales WHERE date BETWEEN ? AND ?', [start, end], (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
  }
}