@Namespace('providers')
export class ProviderController {
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  @On('create')
  public async create(newProvider: Miscellaneous.NewProvider): Promise<any> {
    const { name, phone = '' } = newProvider
    await this.providersModel.create({ name, phone })
    return { ok: true }
  }

  @On('get')
  public async get(id?: Miscellaneous.Provider['id']): Promise<Miscellaneous.Provider[] | Miscellaneous.Provider> {
    if (id) {
      const provider = await this.providersModel.get(Number(id))
      return provider as Miscellaneous.Provider
    }
    return await this.providersModel.getAll()
  }

  @On('update')
  public async update(newProvider: Miscellaneous.Provider): Promise<any> {
    const { id, name, phone = '' } = newProvider
    await this.providersModel.update(id, { name, phone })
    return { ok: true }
  }

  @On('delete')
  public async delete(id: Miscellaneous.Provider['id']): Promise<any> {
    await this.providersModel.delete(id)
    return { ok: true }
  }
}