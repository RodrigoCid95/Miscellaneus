import { verifyAdminSession } from "./middlewares/sessions"

const verifyFields = (veryPass: boolean = true) => async function (req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response, next: Next) {
  if (!req.body) {
    res.json({
      ok: false,
      code: 'bad-request',
      message: 'No hay datos.'
    })
    return
  }
  const { userName, name, password } = req.body as Miscellaneous.NewUser
  if (!userName) {
    res.json({
      ok: false,
      code: 'userName-not-found',
      message: 'Falta el nombre de usuario.'
    })
    return
  }
  if (!name) {
    res.json({
      ok: false,
      code: 'name-not-found',
      message: 'Falta el nombre completo.'
    })
    return
  }
  if (veryPass && !password) {
    res.json({
      ok: false,
      code: 'password-not-found',
      message: 'Falta la contraseña.'
    })
    return
  }
  const { usersModel } = this as UsersController
  const result = await usersModel.get(userName)
  if (password) {
    if (result) {
      res.json({
        ok: false,
        code: 'user-already-exists',
        message: `El usuario "${userName}" ya existe.`
      })
      return
    }
  } else {
    if (result?.rowid !== req.body.id) {
      res.json({
        ok: false,
        code: 'user-already-exists',
        message: `El usuario "${userName}" ya existe.`
      })
      return
    }
  }
  next()
}

@Namespace('api/users')
@Middlewares({ before: [verifyAdminSession] })
export class UsersController {
  @Model('UsersModel') public usersModel: Models<'UsersModel'>
  
  @Get('/')
  public async index(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const results = await this.usersModel.getAll()
    const users = results.filter(user => user.id !== req.session.user?.id)
    res.json(users)
  }
  @Before([verifyFields()])
  @Post('/')
  public async create(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { userName, name, isAdmin = false, password } = req.body as Miscellaneous.NewUser
    await this.usersModel.create({
      name,
      userName,
      isAdmin,
      password,
    })
    res.json({
      ok: true
    })
  }
  @Before([verifyFields(false)])
  @Put('/')
  public async update(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    const { userName, name, isAdmin } = req.body as Miscellaneous.NewUser
    await this.usersModel.update({
      userName,
      name,
      isAdmin
    }, req.body.id || 0)
    res.json({
      ok: true
    })
  }
  @Delete('/:id')
  public async delete(req: PXIOHTTP.Request, res: PXIOHTTP.Response): Promise<void> {
    await this.usersModel.delete(Number(req.params.id || '') as Miscellaneous.User['id'])
    res.json({
      ok: true
    })
  }
}