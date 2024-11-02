import path from 'node:path'
import JsBarcode from 'jsbarcode'
import { createCanvas } from '@napi-rs/canvas'

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

  @Get('/js/services.js')
  public services(_: PXIOHTTP.Request, res: PXIOHTTP.Response): void {
    res.set('Content-Type', 'application/javascript')
    const servicesPath = process.env.BASE_DIR ? path.resolve(__dirname, '..', 'services.js') : path.resolve(__dirname, '..', '..', 'services.js')
    res.sendFile(servicesPath)
  }
}

export * from './apis'