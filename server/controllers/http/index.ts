import path from 'node:path'
import JsBarcode from 'jsbarcode'
import { createCanvas } from '@napi-rs/canvas'

export class IndexController {
  @Model('BarCodesModel') private barCodesModel: Models<'BarCodesModel'>
  @Model('ConfigModel') private configModel: Models<'ConfigModel'>
  @Model('CertificateModel') private certificateModel: Models<'CertificateModel'>

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

  @Before(['loadConfig'])
  @Get('/manifest.json')
  public manifest(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): void {
    res.set('Content-Type', 'application/json')
    let name = 'Miscellaneous'
    if (req.session.config) {
      name = req.session.config.name
    }
    res.json({
      name,
      short_name: name,
      theme_color: "#292929",
      background_color: "#fff",
      display: "fullScreen",
      orientation: "any",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "images/icons/icon-72x72.png",
          sizes: "72x72",
          type: "image/png"
        },
        {
          src: "images/icons/icon-96x96.png",
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: "images/icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "images/icons/icon-144x144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "images/icons/icon-152x152.png",
          sizes: "152x152",
          type: "image/png"
        },
        {
          src: "images/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "images/icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "images/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    })
  }

  @Get('/certificate')
  public certificate(_: PXIOHTTP.Request, res: PXIOHTTP.Response): void {
    res.download(path.join(this.certificateModel.certificate, 'rootCA.crt'))
  }
}

export * from './apis'