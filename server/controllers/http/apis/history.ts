import { verifyAdminSession } from "./middlewares/sessions"

@Namespace('api/history')
@Middlewares({ before: [verifyAdminSession] })
export class HistoryController {
  @Model('HistoryModel') private historyModel: Models<'HistoryModel'>
  @Model('UsersModel') private usersModel: Models<'UsersModel'>
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  @Get('/:start/:end')
  public async range(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
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
    const saleResults = await this.historyModel.findRange(Number(req.params.start), Number(req.params.end))
    const items: Miscellaneous.History[] = []
    for (const saleResult of saleResults) {
      const user = users.find(user => user.id === saleResult.id_user) as Miscellaneous.User
      const product = products.find(product => product.id === saleResult.id_product) as Miscellaneous.Product
      items.push({
        product: product.name,
        user: user.name,
        date: saleResult.date,
        count: saleResult.count,
        total: saleResult.total
      })
    }
    res.json(items)
  }
}