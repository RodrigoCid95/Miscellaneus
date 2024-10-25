export class Emitter {
  #listeners: any[] = []
  on(callback: any): void {
    this.#listeners.push(callback)
  }
  off(callback: any): void {
    this.#listeners = this.#listeners.filter(listener => listener !== callback)
  }
  emit(...args: any[]): void {
    for (const listener of this.#listeners) {
      listener(...args)
    }
  }
}