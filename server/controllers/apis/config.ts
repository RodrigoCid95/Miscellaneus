import { verifySession, verifyAdminSession } from "./middlewares/sessions";

@Namespace('api/config')
export class ConfigController {
  @Model('ConfigModel') private configModel: Models<'ConfigModel'>

  @Before([verifySession])
  @Get('/')
  public async loadConfig(_: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    res.json(await this.configModel.loadConfig())
  }

  @Before([verifyAdminSession])
  @Put('/')
  public async updateConfig(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const { name, ipPrinter } = req.body as Miscellaneous.Config
    if (!name || !ipPrinter) {
      res.json(false)
      return
    }
    await this.configModel.updateConfig({ name, ipPrinter })
    res.json(true)
  }
}