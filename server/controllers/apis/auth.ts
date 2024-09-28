@Namespace('api/auth')
export class AuthController {
  @Model('UsersModel') private usersModel: Models<'UsersModel'>
  @Get('/')
  public index(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): void {
    res.json(req.session.user !== undefined)
  }
  @Post('/')
  public async login(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): Promise<void> {
    const { user_name, password } = req.body
    if (!user_name) {
      res.json({
        ok: false,
        code: 'missing-username',
        message: 'El nombre de usuario es requerido.'
      })
      return
    }
    if (!password) {
      res.json({
        ok: false,
        code: 'missing-password',
        message: 'La contraseña es requerida.'
      })
      return
    }
    const user = await this.usersModel.get(user_name)
    if (!user) {
      res.json({
        ok: false,
        code: 'user-not-found',
        message: 'Usuario no encontrado.'
      })
      return
    }
    const hash = this.usersModel.generateHash(password)
    if (hash !== user.hash) {
      res.json({
        ok: false,
        code: 'wrong-password',
        message: 'La contraseña es incorrecta.'
      })
      return
    }
    req.session.user = {
      id: user.rowid,
      name: user.name,
      userName: user.user_name,
      isAdmin: user.is_admin === 1
    }
    res.json({
      ok: true
    })
  }
  @Delete('/')
  public logout(req: PXIOHTTP.Request<Miscellaneous.Session>, res: PXIOHTTP.Response): void {
    req.session.destroy(() => {
      res.json(true)
    })
  }
}