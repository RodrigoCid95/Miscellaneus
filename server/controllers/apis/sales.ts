import escpos from 'escpos'
import escposUSB from 'escpos-usb'
import escposNetwork from 'escpos-network'
import { verifySession } from './middlewares/sessions'

@Namespace('/api/sales')
@Middlewares({ before: [verifySession] })
export class SalesController {
  @Model('SalesModel') private salesModel: Models<'SalesModel'>
  @Model('UsersModel') public usersModel: Models<'UsersModel'>
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>

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
    const device = new escpos.Network('0.0.0.0', 9100)
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