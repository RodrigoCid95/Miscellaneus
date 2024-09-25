import { type Database } from "sqlite3";

export class SalesModel {
  @Library('db') private db: Database
  public async get(date: Miscellaneous.Sale['date']): Promise<Miscellaneous.SaleResult[]> {
    return await new Promise<Miscellaneous.SaleResult[]>(resolve => {
      this.db.all<Miscellaneous.SaleResult>('SELECT rowid, * FROM sales WHERE date = ?', [date], (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
  }
  public async create({ product, user, date, count, total }: Miscellaneous.NewSale): Promise<void> {
    return await new Promise<void>(resolve => {
      this.db.run('INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)', [product.id, user, date, count, total], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
}