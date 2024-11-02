@Namespace('history')
export class History {
  @Model('HistoryModel') private historyModel: Models<'HistoryModel'>
  @Model('UsersModel') private usersModel: Models<'UsersModel'>
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  private async parseResults(results: Miscellaneous.SaleResult[]): Promise<Miscellaneous.History[]> {
    const users = await this.usersModel.getAll()
    const productResults = await this.productsModel.getAll()
    const providerResults = await this.providersModel.getAll()
    const products: Miscellaneous.Product[] = productResults.map(({ rowid: id, name, description, sku, price, stock, min_stock: minStock, provider: providerId }) => {
      const provider = providerResults.find(provider => provider.id === providerId) as Miscellaneous.Provider
      return {
        id,
        name,
        description,
        sku,
        price,
        stock,
        minStock,
        provider
      }
    })
    const items: Miscellaneous.History[] = []
    for (const saleResult of results) {
      const user = users.find(user => user.id === saleResult.id_user) as Miscellaneous.User
      const product = products.find(product => product.id === saleResult.id_product) as Miscellaneous.Product
      items.push({
        id: saleResult.rowid,
        product: product.name,
        user: user.name,
        date: saleResult.date,
        count: saleResult.count,
        total: saleResult.total
      })
    }
    return items
  }

  private async returnResults(start: number, end: number, user: Miscellaneous.User): Promise<Miscellaneous.History[]> {
    let id: Miscellaneous.User['id'] | undefined = undefined
    if (!user.isAdmin) {
      id = user.id
    }
    const saleResults: Miscellaneous.SaleResult[] = await this.historyModel.findRange(start, end, id)
    const items = await this.parseResults(saleResults)
    return items
  }

  @On('getToDay')
  public async getToDay(user: Miscellaneous.User): Promise<Miscellaneous.History[]> {
    if (user.isAdmin) {
      return []
    }
    const date = new Date()
    const { start, end } = timeUTC.getStartAndEndOfDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
    const results = await this.returnResults(start, end, user)
    return results
  }

  @On('getFromDay')
  public async getFromDay(user: Miscellaneous.User, year: number, month: number, day: number): Promise<Miscellaneous.History[]> {
    const { start, end } = timeUTC.getStartAndEndOfDay(year, month, day)
    const results = await this.returnResults(start, end, user)
    return results
  }

  @On('getFromWeek')
  public async getFromWeek(user: Miscellaneous.User, year: number, week: number): Promise<Miscellaneous.History[]> {
    const { start, end } = timeUTC.getStartAndEndOfWeek(year, week)
    const results = await this.returnResults(start, end, user)
    return results
  }

  @On('getFromMonth')
  public async getFromMonth(user: Miscellaneous.User, year: number, month: number): Promise<Miscellaneous.History[]> {
    const { start, end } = timeUTC.getStartAndEndOfMonth(year, month)
    const results = await this.returnResults(start, end, user)
    return results
  }

  @On('getFromYear')
  public async getFromYear(user: Miscellaneous.User, year: number): Promise<Miscellaneous.History[]> {
    const { start, end } = timeUTC.getStartAndEndOfYear(year)
    const results = await this.returnResults(start, end, user)
    return results
  }

  @On('restore')
  public async restore(user: Miscellaneous.User, id: number): Promise<boolean> {
    const saleResult = await this.historyModel.findByID(id)
    if (!saleResult) {
      return true
    }
    if (saleResult.id_user !== user.id && !user.isAdmin) {
      return true
    }
    const product = await this.productsModel.get(saleResult.id_product) as Miscellaneous.ProductResult
    await this.productsModel.update(product.rowid, { ...product, minStock: product.min_stock, stock: product.stock + saleResult.count })
    await this.historyModel.delete(saleResult.rowid)
    return true
  }
}