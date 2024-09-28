import escpos from 'escpos'
import escposUSB from 'escpos-usb'
import escposNetwork from 'escpos-network'

@Namespace('/api/sales')
export class SalesController {
  @Model('SalesModel') private salesModel: Models<'SalesModel'>
  @Model('UsersModel') public usersModel: Models<'UsersModel'>
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  @Get('/:day/:mouth/:year')
  public async get(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { day, mouth, year } = req.params
    const date = `${day}/${mouth}/${year}`
    const saleResults = await this.salesModel.get(date)
    const users = await this.usersModel.getAll()
    const productsResults = await this.productsModel.getAll()
    const providers = await this.providersModel.getAll()
    const products: Miscellaneous.Product[] = productsResults.map(({ rowid: id, name, description, sku, price, stock, min_stock: minStock, provider: providerId }) => {
      const provider = providers.find(provider => provider.id === providerId) as Miscellaneous.Provider
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
    const sales: Miscellaneous.Sale[] = []
    for (const saleResult of saleResults) {
      const user = users.find(user => user.id === saleResult.id_user) as Miscellaneous.User
      const product = products.find(product => product.id === saleResult.id_product) as Miscellaneous.Product
      sales.push({
        id: saleResult.rowid,
        product,
        user,
        date: `saleResult.date`,
        count: saleResult.count,
        total: saleResult.total
      })
    }
    res.json(sales)
  }
  @Post('/')
  public async create(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const sales: Miscellaneous.NewSale[] = req.body
    if (!Array.isArray(sales)) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    const { id: idUser } = req.session.user as Miscellaneous.User
    const date = new Date()
    const UTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds())
    const report: string[][] = []
    let totalTotal = 0
    for (const { product, count, total } of sales) {
      if (!product || !count || !total) {
        res.json({
          ok: false,
          code: 'bad-request',
          message: 'No hay datos.'
        })
        return
      }
      const productResult = await this.productsModel.get(product) as Miscellaneous.ProductResult
      await this.salesModel.create({ product, count, total }, idUser, UTC)
      await this.productsModel.update(product, {
        name: productResult.name,
        description: productResult.description,
        sku: productResult.sku,
        price: productResult.price,
        stock: productResult.stock - count,
        minStock: productResult.min_stock,
        provider: productResult.provider
      })
      report.push([count.toString(), productResult.name, total.toFixed(2).toString()])
      totalTotal += total
    }
    escpos.USB = escposUSB
    escpos.Network = escposNetwork
    const device = new escpos.Network('0.0.0.0', 1234)
    const printer = new escpos.Printer(device)
    await new Promise(resolve => device.open(() => {
      printer
        .text('Miscellaneous - Point of Sale')
        .text(`Fecha : ${new Date().toLocaleString()}`)
        .drawLine()
      printer.table(['Cantidad', 'Producto', 'Subtotal'])
      for (const [count, name, total] of report) {
        printer.table([count, name, `$${total}`])
      }
      printer.drawLine()
        .text(`Total: $${totalTotal.toFixed(2)}`)
        .cut()
        .close(resolve)
    }))
    res.json({
      ok: true
    })
  }
}