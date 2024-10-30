import { verifyAdminSession } from './middlewares/sessions'

@Namespace('api', 'bar-codes')
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