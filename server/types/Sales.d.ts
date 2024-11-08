declare global {
  namespace Miscellaneous {
    interface Sale {
      id: number
      product: Miscellaneous.Product
      user: Miscellaneous.User
      date: string
      count: number
      total: number
    }
    interface SaleResult {
      rowid: number
      id_product: Miscellaneous.ProductResult['rowid']
      id_user: Miscellaneous.UserResult['rowid']
      date: number
      count: number
      total: number
    }
    interface NewSale {
      product: Miscellaneous.ProductResult['rowid']
      count: number
      total: number
    }
  }
}

export { }