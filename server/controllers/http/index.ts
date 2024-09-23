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
    res.json(req.session.user)
  }
}

export * from './apis'