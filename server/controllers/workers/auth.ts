@Namespace('auth')
export class AuthController {
  @Model('UsersModel') private usersModel: Models<'UsersModel'>

  @On('login')
  public async login(user_name: string, password: string): Promise<any> {
    if (!user_name) {
      return {
        ok: false,
        code: 'missing-username',
        message: 'El nombre de usuario es requerido.'
      }
    }
    if (!password) {
      return {
        ok: false,
        code: 'missing-password',
        message: 'La contraseña es requerida.'
      }
    }
    const user = await this.usersModel.get(user_name)
    if (!user) {
      return {
        ok: false,
        code: 'user-not-found',
        message: 'Usuario no encontrado.'
      }
    }
    const hash = this.usersModel.generateHash(password)
    if (hash !== user.hash) {
      return {
        ok: false,
        code: 'wrong-password',
        message: 'La contraseña es incorrecta.'
      }
    }
    return {
      id: user.rowid,
      name: user.name,
      userName: user.user_name,
      isAdmin: user.is_admin === 1
    }
  }
}