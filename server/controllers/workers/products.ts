@Namespace('products')
export class ProductsController {
  @Model('ProductsModel') private productsModel: Models<'ProductsModel'>
  @Model('ProvidersModel') private providersModel: Models<'ProvidersModel'>

  @On('find')
  public async find(query: string = ''): Promise<Miscellaneous.Product[]> {
    const productResults = await this.productsModel.find(query)
    const providerResults = await this.providersModel.getAll()
    const products: Miscellaneous.Product[] = productResults.map(({ rowid: id, name, description, sku, price, stock, min_stock: minStock, provider: providerId }) => {
      const provider = providerResults.find(provider => provider.id === providerId) as Miscellaneous.Provider
      return {
        id,
        name,
        description,
        sku,
        price,
        stock,
        minStock,
        provider
      }
    })
    return products
  }

  @On('create')
  public async create(newProduct: Miscellaneous.NewProduct): Promise<any> {
    const { name, description, sku, price, stock, minStock, provider } = newProduct
    await this.productsModel.create({ name, description, sku, price, stock, minStock, provider })
    return { ok: true }
  }

  @On('get')
  public async get(): Promise<Miscellaneous.Product[]> {
    const productResults = await this.productsModel.getAll()
    const providerResults = await this.providersModel.getAll()
    const products: Miscellaneous.Product[] = productResults.map(({ rowid: id, name, description, sku, price, stock, min_stock: minStock, provider: providerId }) => {
      const provider = providerResults.find(provider => provider.id === providerId) as Miscellaneous.Provider
      return {
        id,
        name,
        description,
        sku,
        price,
        stock,
        minStock,
        provider
      }
    })
    return products
  }

  @On('update')
  public async update(id: Miscellaneous.Product['id'], product: Miscellaneous.NewProduct): Promise<any> {
    const { name, description, sku, price, stock, minStock, provider } = product
    await this.productsModel.update(id, { name, description, sku, price, stock, minStock, provider })
    return {
      ok: true
    }
  }

  @On('delete')
  public async delete(id: Miscellaneous.Product['id']): Promise<any> {
    await this.productsModel.delete(id)
    return {
      ok: true
    }
  }
}