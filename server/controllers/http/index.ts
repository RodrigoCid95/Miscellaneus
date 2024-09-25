import escpos from 'escpos'
import escposUSB from 'escpos-usb'
import escposNetwork from 'escpos-network'
import { verifyPointSaleSession, verifyAdminSession } from './middlewares/sessions'

export class IndexController {
  @Model('UsersModel') private usersModel: Models<'UsersModel'>

  @Before([verifyPointSaleSession])
  @View('/')
  public index = 'index'

  @Before([verifyAdminSession])
  @View('/admin')
  public admin = 'admin'

  @View('/scanner')
  public scanner = 'scanner'

  @Get('/test')
  public test(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response) {
    escpos.USB = escposUSB
    escpos.Network = escposNetwork
    const device = new escpos.Network('0.0.0.0', 1234)
    const printer = new escpos.Printer(device)
    device.open(() => {
      printer
        .text('Miscellaneous - Point of Sale')
        .text(`Fecha : ${new Date().toLocaleString()}`)
        .drawLine()
        .table(["Cantidad", "Producto", "Subtotal"])
        .table(["2", "Coca Cola", "$45"])
      printer.table(["2", "Coca Cola", "$45"])
        .table(["2", "Coca Cola", "$45"])
        .drawLine()
        .text('Total: $15.00')
        .cut()
        .close()
    })
    res.json(true)
  }
}

export * from './apis'