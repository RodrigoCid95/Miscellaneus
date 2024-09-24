import JsBarcode from 'jsbarcode'
import { createCanvas } from 'canvas'
import { verifyAdminSession } from './middlewares/sessions'

@Namespace('api/bar-codes')
@Middlewares({ before: [verifyAdminSession] })
export class BarCodesController {
  @Model('BarCodesModel') private barCodesModel: Models<'BarCodesModel'>
  @Get('/')
  public async index(_: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const results = await this.barCodesModel.getAll()
    res.json(results)
  }
  @Post('/')
  public async create(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { name, tag = '', value } = req.body
    if (!name || !value) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.barCodesModel.create({ name, tag, value })
    res.json({
      ok: true
    })
  }
  @Put('/')
  public async update(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id, name, tag = '', value } = req.body
    if (!id || !name || !value) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.barCodesModel.update(Number(id), { name, tag, value })
    res.json({
      ok: true
    })
  }
  @Delete('/:id')
  public async delete(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id = '' } = req.params
    await this.barCodesModel.delete(Number(id))
    res.json({
      ok: true
    })
  }
}

@Namespace('api/bar-code')
export class BarCodeController {
  @Model('BarCodesModel') private barCodesModel: Models<'BarCodesModel'>
  @Get('/:value')
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
    res.set('Content-Type', 'image/png')
    res.send(canvas.toBuffer())
  }
}