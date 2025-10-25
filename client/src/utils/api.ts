type Callback<R, A> = (args: A) => Promise<R>

export const api = <T = void, A = any>(callback: Callback<T, A>, args: A): Promise<T> => new Promise<T>((resolve, reject) => {
  callback(args)
    .then(data => resolve(data))
    .catch(error => {
      if (typeof error === "string") {
        if (/^\s*(\{.*\}|\[.*\])\s*$/.test(error)) {
          const dataError = JSON.parse(error)
          const apiError = new APIError(dataError)
          reject(apiError)
        } else {
          reject(error)
        }
      } else {
        reject(error)
      }
    })
})

export class APIError extends Error {
  code: string
  constructor(data: { message: string; code: string; }) {
    const message = data?.message || 'Error al procesar la solicitud.'
    const code = data?.code || 'APIError'
    const name = code
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
    super(message)
    this.message = message
    this.name = name
    this.code = code
  }
}