@Namespace('users')
export class UsersController {
  @Model('UsersModel') public usersModel: Models<'UsersModel'>

  @On('create')
  public async create(user: Miscellaneous.NewUser): Promise<any> {
    await this.usersModel.create(user)
    return { ok: true }
  }

  @On('get')
  public async get(id: Miscellaneous.User['id']): Promise<Miscellaneous.User[]> {
    const results = await this.usersModel.getAll()
    const users = results.filter(user => user.id !== id)
    return users
  }

  @On('update')
  public async update(user: Miscellaneous.User): Promise<any> {
    const { id, name, userName, isAdmin } = user
    await this.usersModel.update({ name, userName, isAdmin }, id)
    return { ok: true }
  }

  @On('delete')
  public async delete(id: Miscellaneous.User['id']): Promise<any> {
    await this.usersModel.delete(id)
    return { ok: true }
  }
}