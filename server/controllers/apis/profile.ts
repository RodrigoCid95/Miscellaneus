import { verifySession } from "./middlewares/sessions";

@Namespace('api/profile')
@Middlewares({ before: [verifySession] })
export class ProfileController {
  @Model('UsersModel') private usersModel: Models<'UsersModel'>
  @Get('/')
  public index(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): void {
    res.json(req.session.user)
  }
  @Post('/')
  public async update(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const { name, userName } = req.body
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
    const { id, isAdmin } = req.session.user as Miscellaneous.User
    const result = await this.usersModel.get(name)
    if (result && result.rowid !== id) {
      res.json({
        ok: false,
        code: 'user-already-exists',
        message: `El usuario "${userName}" ya existe.`
      })
      return
    }
    await this.usersModel.update({ name, userName, isAdmin }, id)
    res.json({
      ok: true
    })
  }
  @Put('/')
  public async updatePassword(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const { currentPass, newPass } = req.body
    if (!currentPass || !newPass) {
      res.json({
        ok: false,
        code: 'bad-request',
        message: 'No hay datos.'
      })
      return
    }
    const result = await this.usersModel.get(req.session.user?.userName || '') as unknown as Miscellaneous.UserResult
    const currentHash = this.usersModel.generateHash(currentPass)
    if (result.hash !== currentHash) {
      res.json({
        ok: false,
        code: 'password-invalid',
        message: 'La contraseña es incorrecta.'
      })
      return
    }
    await this.usersModel.updatePassword(newPass, req.session.user?.id || NaN)
    res.json({
      ok: true
    })
  }
}