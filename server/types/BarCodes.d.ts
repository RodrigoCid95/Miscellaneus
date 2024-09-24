declare global {
  namespace Miscellaneous {
    interface BarCode {
      id: number
      name: string
      tag?: string
      value: string
    }
    interface NewBarCode extends Omit<BarCode, 'id'> { }
    interface BarCodeResult extends Omit<BarCode, 'id'> {
      rowid: number
      name: string
      tag?: string
      value: string
    }
  }
}

export { }