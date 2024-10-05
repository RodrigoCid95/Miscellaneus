import { verifySession, verifyAdminSession } from "./middlewares/sessions"

@Namespace('api/history')
export class HistoryController {
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

  @Before([verifySession])
  @Get('/')
  public async rangeToDay(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const user = req.session.user as Miscellaneous.User
    if (user.isAdmin) {
      res.json([])
      return
    }
    const date = new Date()
    const startUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0, 0)
    date.setDate(date.getDate() + 1)
    const endUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0, 0)
    const saleResults: Miscellaneous.SaleResult[] = await this.historyModel.findRange(startUTC, endUTC, user.id)
    const items = await this.parseResults(saleResults)
    res.json(items)
  }

  @Before([verifyAdminSession])
  @Get('/:start/:end')
  public async range(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const saleResults: Miscellaneous.SaleResult[] = await this.historyModel.findRange(Number(req.params.start), Number(req.params.end))
    const items = await this.parseResults(saleResults)
    res.json(items)
  }

  @Before([verifySession])
  @Delete('/:id')
  public async restore(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const user = req.session.user as Miscellaneous.User
    const saleResult = await this.historyModel.findByID(Number(req.params.id))
    if (!saleResult) {
      res.json(true)
      return
    }
    if (saleResult.id_user !== user.id && !user.isAdmin) {
      res.json(true)
      return
    }
    const product = await this.productsModel.get(saleResult.id_product) as Miscellaneous.ProductResult
    await this.productsModel.update(product.rowid, { ...product, minStock: product.min_stock, stock: product.stock + saleResult.count })
    await this.historyModel.delete(saleResult.rowid)
    res.json(true)
  }
}