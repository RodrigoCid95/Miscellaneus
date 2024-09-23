import { Emitter } from './Emitters'

class ProfileController {
  #changeEmitter: Emitter
  #profile: Miscellaneous.User | null
  set profile(value: Miscellaneous.User) {
    this.#profile = value
    this.#changeEmitter.emit()
  }
  get profile(): Miscellaneous.User | null {
    return this.#profile
  }
  constructor() {
    this.#changeEmitter = new Emitter()
    this.#profile = null
  }
  onChange(callback: Callback) {
    this.#changeEmitter.on(callback)
  }
  off(callback: Callback) {
    this.#changeEmitter.off(callback)
  }
}

const profileController = new ProfileController()

export { profileController }