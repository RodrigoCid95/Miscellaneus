import JsBarcode from 'jsbarcode'
import { createCanvas } from '@napi-rs/canvas'
import escpos from 'escpos'
import escposUSB from 'escpos-usb'
import escposNetwork from 'escpos-network'

export class IndexController {
  @Model('BarCodesModel') private barCodesModel: Models<'BarCodesModel'>
  @Model('ConfigModel') private configModel: Models<'ConfigModel'>

  public async loadConfig(req: PXIOHTTP.Request<Miscellaneous.Session>, _: PXIOHTTP.Response, next: Next): Promise<void> {
    if (!req.session.config) {
      req.session.config = await this.configModel.loadConfig()
    }
    next()
  }

  @Before(['loadConfig'])
  @View('/')
  public index = 'index'
  
  @Get('/bar-code/:value')
  public async barCode(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { value } = req.params
    const { title } = req.query
    let barCode = await this.barCodesModel.get(Number(value))
    if (!barCode) {
      barCode = {
        id: NaN,
        name: '',
        tag: typeof title === 'string' ? title !== '' ? title : value : value,
        value
      }
    }
    const canvas = createCanvas(1000, 1000)
    JsBarcode(canvas, barCode.value, {
      text: barCode.tag
    })
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    res.set('Surrogate-Control', 'no-store')
    res.set('Content-Type', 'image/webp')
    res.send(canvas.toBuffer('image/webp'))
  }

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