import { verifySession, verifyAdminSession } from "./middlewares/sessions"

const verifyParams = (req: PXIOHTTP.Request, res: PXIOHTTP.Response, next: Next) => {
  const keysParamsEntries = Object.entries(req.params)
  for (const [key, value] of keysParamsEntries) {
    const val = Number(value)
    if (isNaN(val)) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'Parametros invalidos.'
      })
      return
    }
    req.body[key] = val
  }
  const user = Number(req.query.user)
  if (!isNaN(user)) {
    req.body.user = user
  }
  next()
}

@Namespace('api', 'history')
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

  public async returnResults(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    let { start, end, user: id } = req.body
    const user = req.session.user as Miscellaneous.User
    if (!user.isAdmin) {
      id = user.id
    }
    const saleResults: Miscellaneous.SaleResult[] = await this.historyModel.findRange(start, end, id)
    const items = await this.parseResults(saleResults)
    res.json(items)
  }

  @Before([verifySession])
  @After(['returnResults'])
  @Get('/')
  public async rangeToDay(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next): Promise<void> {
    const user = req.session.user as Miscellaneous.User
    if (user.isAdmin) {
      res.json([])
      return
    }
    const date = new Date()
    req.body = timeUTC.getStartAndEndOfDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
    next()
  }

  @Before([verifyAdminSession, verifyParams])
  @After(['returnResults'])
  @Get('/day/:year/:month/:day')
  public async day(req: PXIOHTTP.Request, _: PXIOHTTP.Response, next: Next): Promise<void> {
    const { year, month, day } = req.body
    req.body = { ...req.body, ...timeUTC.getStartAndEndOfDay(year, month, day) }
    next()
  }

  @Before([verifyAdminSession, verifyParams])
  @After(['returnResults'])
  @Get('/week/:year/:week')
  public async week(req: PXIOHTTP.Request, _: PXIOHTTP.Response, next: Next): Promise<void> {
    const { year, week } = req.body
    req.body = { ...req.body, ...timeUTC.getStartAndEndOfWeek(year, week) }
    next()
  }

  @Before([verifyAdminSession, verifyParams])
  @After(['returnResults'])
  @Get('/month/:year/:month')
  public async month(req: PXIOHTTP.Request, _: PXIOHTTP.Response, next: Next): Promise<void> {
    const { year, month } = req.body
    req.body = { ...req.body, ...timeUTC.getStartAndEndOfMonth(year, month) }
    next()
  }
  
  @Before([verifyAdminSession, verifyParams])
  @After(['returnResults'])
  @Get('/year/:year')
  public async year(req: PXIOHTTP.Request, _: PXIOHTTP.Response, next: Next): Promise<void> {
    const { year } = req.body
    req.body = { ...req.body, ...timeUTC.getStartAndEndOfYear(year) }
    next()
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