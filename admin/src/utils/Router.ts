import { Emitter } from "./Emitters"

class Router {
  #listeners: RouterListeners
  #path: string
  set path(value: string) {
    this.#path = value
    this.#listeners.change.emit()
  }
  get path(): string {
    return this.#path
  }
  constructor() {
    this.#listeners = {
      change: new Emitter()
    }
    this.#path = 'products'
  }
  on(event: RouterEvents, callback: Callback) {
    this.#listeners[event].on(callback)
  }
  off(event: RouterEvents, callback: Callback) {
    this.#listeners[event].off(callback)
  }
}

type RouterEvents = 'change'
type RouterListeners = {
  [event in RouterEvents]: Emitter
}

const router = new Router()

export { router }