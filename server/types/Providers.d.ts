declare global {
  namespace Miscellaneous {
    interface Provider {
      id: number
      name: string
      phone: string
    }
    interface NewProvider extends Omit<Provider, 'id'> { }
    interface ProviderResult extends Omit<Provider, 'id'> {
      rowid: number
    }
  }
}

export { }