import { Emitter } from './Emitters'

export class ConfigController {
  #changeEmitter: Emitter
  #config: Miscellaneous.Config | null
  set config(value: Miscellaneous.Config) {
    this.#config = value
    if (value) {
      document.title = `${value.name} | Administrador`
    }
    this.#changeEmitter.emit()
  }
  get config(): Miscellaneous.Config | null {
    return this.#config
  }
  constructor() {
    this.#changeEmitter = new Emitter()
    this.#config = null
  }
  onChange(callback: Callback) {
    this.#changeEmitter.on(callback)
  }
  off(callback: Callback) {
    this.#changeEmitter.off(callback)
  }
}

const configController = new ConfigController()

export { configController }