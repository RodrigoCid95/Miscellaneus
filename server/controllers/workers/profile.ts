@Namespace('profile')
export class ProfileController {
  @Model('UsersModel') private usersModel: Models<'UsersModel'>

  @On('get')
  public async get(userName: Miscellaneous.User['userName']): Promise<Miscellaneous.User> {
    const { rowid, name, user_name, is_admin } = await this.usersModel.get(userName) as Miscellaneous.UserResult
    return { id: rowid, name, userName: user_name, isAdmin: is_admin === 1 }
  }

  @On('update')
  public async update(user: Miscellaneous.User): Promise<any> {
    const { id, name, userName, isAdmin } = user
    const result = await this.usersModel.get(name)
    if (result && result.rowid !== id) {
      return {
        ok: false,
        code: 'user-already-exists',
        message: `El usuario "${userName}" ya existe.`
      }
    }
    await this.usersModel.update({ name, userName, isAdmin }, id)
    return { ok: true }
  }

  @On('updatePassword')
  public async updatePassword(user: Miscellaneous.User, currentPass: string, newPass: string): Promise<any> {
    const result = await this.usersModel.get(user.userName) as unknown as Miscellaneous.UserResult
    const currentHash = this.usersModel.generateHash(currentPass)
    if (result.hash !== currentHash) {
      return {
        ok: false,
        code: 'password-invalid',
        message: 'La contraseña es incorrecta.'
      }
    }
    await this.usersModel.updatePassword(newPass, user.id)
    return { ok: true }
  }
}