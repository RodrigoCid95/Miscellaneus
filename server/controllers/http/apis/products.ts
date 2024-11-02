import { verifyAdminSession, verifySession } from "./middlewares/sessions"

@Namespace('api', 'products')
@Middlewares({ before: [verifyAdminSession] })
export class ProductsController {
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>
  
  @Get('/')
  public async index(_: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
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
    res.json(products)
  }
  @Post('/')
  public async create(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { name, description, sku, price, stock, minStock, provider } = req.body
    if (!name || !sku || !price || !stock || !minStock || !provider) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.productsModel.create({ name, description, sku, price, stock, minStock, provider })
    res.json({
      ok: true
    })
  }
  @Put('/')
  public async update(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id, name, description, sku, price, stock, minStock, provider } = req.body
    if (!id || !name || !sku || !price || !stock || !minStock || !provider) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.productsModel.update(id, { name, description, sku, price, stock, minStock, provider })
    res.json({
      ok: true
    })
  }
  @Delete('/:id')
  public async delete(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id = '' } = req.params
    await this.productsModel.delete(Number(id))
    res.json({
      ok: true
    })
  }
}

@Namespace('api/products')
@Middlewares({ before: [verifySession] })
export class ProductsPublicController {
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  @Get('/:query')
  public async get(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { query = '' } = req.params
    const productResults = await this.productsModel.find(query)
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
    res.json(products)
  }
}