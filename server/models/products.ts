import { type Database } from "sqlite3"

export class ProductsModel {
  @Library('db') private db: Database

  public async getAll(): Promise<Miscellaneous.ProductResult[]> {
    return await new Promise<Miscellaneous.ProductResult[]>(resolve => {
      this.db.all<Miscellaneous.ProductResult>('SELECT rowid, * FROM products', (err, rows) => {
        if (err) {
          console.error(err)
          resolve([])
        } else {
          resolve(rows)
        }
      })
    })
  }
  public async get(id: Miscellaneous.Product['id']): Promise<Miscellaneous.ProductResult | null> {
    return await new Promise<Miscellaneous.ProductResult | null>(resolve => {
      this.db.get<Miscellaneous.ProductResult>('SELECT rowid, * FROM products WHERE rowid = ?', [id], (err, row) => {
        if (err) {
          console.error(err)
          resolve(null)
        } else {
          resolve(row || null)
        }
      })
    })
  }
  public async create({ name, description, sku, price, stock, minStock, provider }: Miscellaneous.NewProduct): Promise<void> {
    await new Promise<void>(resolve => {
      this.db.run('INSERT INTO products (name, description, sku, price, stock, min_stock, provider) VALUES (?, ?, ?, ?, ?, ?)', [name, description, sku, price, stock, minStock, provider], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
  public async update(id: Miscellaneous.Product['id'], { name, description, sku, price, stock, minStock, provider }: Miscellaneous.NewProduct): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('UPDATE products SET name = ?, description = ?, sku = ?, price = ?, stock = ?, min_stock = ?, provider = ? WHERE rowid = ?', [name, description, sku, price, stock, minStock, provider, id], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
  public async delete(id: Miscellaneous.Product['id']): Promise<void> {
    if (isNaN(id)) {
      return
    }
    await new Promise<void>(resolve => {
      this.db.run('DELETE FROM products WHERE rowid = ?', [id], (err) => {
        if (err) {
          console.error(err)
        }
        resolve()
      })
    })
  }
}