@Namespace('api/providers')
export class ProviderController {
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>
  @Get('/')
  public async get(_: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const providers = await this.providersModel.getAll()
    res.json(providers)
  }
  @Post('/')
  public async create(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { name, phone = '' } = req.body
    if (!name) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.providersModel.create({ name, phone })
    res.json({
      ok: true
    })
  }
  @Put('/')
  public async update(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id, name, phone = '' } = req.body
    if (!id || !name) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    await this.providersModel.update(Number(id), { name, phone })
    res.json({
      ok: true
    })
  }
  @Delete('/:id')
  public async delete(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { id = '' } = req.params
    await this.providersModel.delete(Number(id))
    res.json({
      ok: true
    })
  }
}