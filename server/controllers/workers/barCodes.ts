import JsBarcode from 'jsbarcode'
import { createCanvas } from '@napi-rs/canvas'

@Namespace('bar-codes')
export class BarCodesController {
  @Model('BarCodesModel') private barCodesModel: Models<'BarCodesModel'>

  @On('create')
  public async create(newBarCode: Miscellaneous.NewBarCode): Promise<any> {
    const { name, tag = '', value } = newBarCode
    await this.barCodesModel.create({ name, tag, value })
    return {
      ok: true
    }
  }

  @On('get')
  public get(): Promise<any> {
    return this.barCodesModel.getAll()
  }

  @On('update')
  public async update(barCode: Miscellaneous.BarCode): Promise<any> {
    const { id, name, tag = '', value } = barCode
    await this.barCodesModel.update(id, { name, tag, value })
    return {
      ok: true
    }
  }

  @On('delete')
  public async delete(id: Miscellaneous.BarCode['id']): Promise<any> {
    await this.barCodesModel.delete(id)
    return {
      ok: true
    }
  }

  @On('getSrc')
  public async getSrc(id: Miscellaneous.BarCode['id']): Promise<any> {
    const barCode = await this.barCodesModel.get(id) as Miscellaneous.BarCode
    const canvas = createCanvas(1000, 1000)
    JsBarcode(canvas, barCode.value, {
      text: barCode.tag
    })
    return canvas.toDataURLAsync('image/webp')
  }
}