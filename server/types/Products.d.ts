declare global {
  namespace Miscellaneous {
    interface Product {
      id: number
      name: string
      description?: string
      sku: string
      price: number
      stock: number
      minStock: number
      provider: Provider
    }
    interface ProductResult extends Omit<Omit<Product, 'id'>, 'provider'> {
      rowid: number
      name: string
      description?: string
      sku: string
      price: number
      min_stock: number
      provider: number
    }
    interface NewProduct extends Omit<Omit<ProductResult, 'rowid'>, 'min_stock'> {
      minStock: number
    }
    interface ProductGroup extends Miscellaneous.Product {
      count: number
    }
  }
}

export { }