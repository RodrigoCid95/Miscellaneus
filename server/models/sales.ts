import { type Database } from "sqlite3"

export class SalesModel {
  @Library('db') private db: Database
  public async create({ product, count, total }: Miscellaneous.NewSale, idUser: Miscellaneous.User['id'], date: Miscellaneous.SaleResult['date']): Promise<void> {
    return await new Promise<void>(resolve => {
      this.db.run('INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)', [product, idUser, date, count, total], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
}