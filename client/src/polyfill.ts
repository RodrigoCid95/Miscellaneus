import { structs } from '../wailsjs/go/models'

type AuthController = typeof import('./../wailsjs/go/controllers/Auth')
type ProfileController = typeof import('./../wailsjs/go/controllers/Profile')
type UsersController = typeof import('./../wailsjs/go/controllers/Users')
type ProvidersController = typeof import('./../wailsjs/go/controllers/Providers')
type BarCodesController = typeof import('./../wailsjs/go/controllers/BarCodes')
type ProductsController = typeof import('./../wailsjs/go/controllers/Products')
type HistoryController = typeof import('./../wailsjs/go/controllers/History')
type ConfigController = typeof import('./../wailsjs/go/controllers/Config')
type CheckoutController = typeof import('./../wailsjs/go/controllers/Checkout')

const processResponse = async <R>(response: Response): Promise<R> => {
  if (response.status === 500) {
    throw new Error('Error al intentar conectar con el servidor.')
  }
  const data = await response.text()
  if (response.status > 199 && response.status < 300) {
    const isJSON = response.headers.get('content-type')?.includes('application/json')
    if (isJSON) {
      return JSON.parse(data)
    }
    return data as any
  }
  throw data
}

const headers = new Headers()
headers.append('Content-Type', 'application/json')

const Auth: AuthController = {
  async Login(credentials) {
    const resp = await fetch(`${window.location.origin}/api/auth`, {
      method: 'post',
      headers,
      body: JSON.stringify(credentials),
    })
    const result = await processResponse<boolean>(resp)
    return result
  },
  async Logout() {
    const resp = await fetch(`${window.location.origin}/api/auth`, { method: 'delete' })
    const result = await processResponse<void>(resp)
    return result
  }
}

const Profile: ProfileController = {
  async GetProfile() {
    const resp = await fetch('/api/profile')
    const result = await processResponse<structs.User>(resp)
    return result
  },
  async UpdatePassword(arg1) {
    const resp = await fetch(`${window.location.origin}/api/profile`, {
      method: 'post',
      headers,
      body: JSON.stringify(arg1)
    })
    const result = await processResponse<void>(resp)
    return result
  },
  async UpdateProfile(arg1) {
    const resp = await fetch(`${window.location.origin}/api/profile`, {
      method: 'put',
      headers,
      body: JSON.stringify(arg1)
    })
    const result = await processResponse<void>(resp)
    return result
  },
}

const Users: UsersController = {
  async CreateUser(data) {
    const resp = await fetch('/api/users', {
      method: 'post',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async GetUsers() {
    const resp = await fetch('/api/users')
    const response = await processResponse<structs.User[]>(resp)
    return response || []
  },
  async UpdateUser(data) {
    const resp = await fetch('/api/users', {
      method: 'put',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async DeleteUser(id) {
    const resp = await fetch(`/api/users/${id}`, { method: 'delete' })
    const response = await processResponse<void>(resp)
    return response
  },
}

const Providers: ProvidersController = {
  async SaveProvider(data) {
    const resp = await fetch('/api/providers', {
      method: 'post',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async GetProviders() {
    const resp = await fetch('api/providers')
    const response = await processResponse<structs.Provider[]>(resp)
    return response || []
  },
  async UpdateProvider(data) {
    const resp = await fetch('/api/providers', {
      method: 'put',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async DeleteProvider(id) {
    const resp = await fetch(`/api/providers/${id}`, { method: 'delete' })
    const response = await processResponse<void>(resp)
    return response
  },
}

const BarCodes: BarCodesController = {
  async CreateBarCode(data) {
    const resp = await fetch('/api/bar-codes', {
      method: 'post',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async GetBarCodes() {
    const resp = await fetch('/api/bar-codes')
    const response = await processResponse<structs.BarCode[]>(resp)
    return response || []
  },
  async UpdateBarCode(data) {
    const resp = await fetch('api/bar-codes', {
      method: 'put',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async DeleteBarCode(id) {
    const resp = await fetch(`/api/bar-codes/${id}`, {
      method: 'delete'
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async GetBarCodeSrc(id) {
    const resp = await fetch(`/api/bar-codes/${id}`)
    const response = await processResponse<string>(resp)
    return response
  },
}

const Products: ProductsController = {
  async CreateProduct(data) {
    const resp = await fetch(`${window.location.origin}/api/products`, {
      method: 'post',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async GetProducts() {
    const resp = await fetch(`${window.location.origin}/api/products`)
    const response = await processResponse<structs.Product[]>(resp)
    return response || []
  },
  async GetFilterProducts(data) {
    let url = `${window.location.origin}/api/products`
    if (data !== "") {
      url = `${window.location.origin}/api/products/${data}`
    }
    const resp = await fetch(url)
    const response = await processResponse<structs.Product[]>(resp)
    return response || []
  },
  async UpdateProduct(data) {
    const resp = await fetch(`${window.location.origin}/api/products`, {
      method: 'put',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    return response
  },
  async DeleteProduct(data) {
    const resp = await fetch(`${window.location.origin}/api/products/${data}`, { method: 'delete' })
    const response = await processResponse<void>(resp)
    return response
  },
}

const History: HistoryController = {
  async GetDayHistory(data) {
    const resp = await fetch(`${window.location.origin}/api/history/day/${data.year}/${data.month}/${data.day}`)
    const response = await processResponse<Array<structs.HistoryItem>>(resp)
    return response || []
  },
  async GetWeekHistory(data) {
    const resp = await fetch(`${window.location.origin}/api/history/week/${data.year}/${data.week}`)
    const response = await processResponse<Array<structs.HistoryItem>>(resp)
    return response || []
  },
  async GetMonthHistory(data) {
    const resp = await fetch(`${window.location.origin}/api/history/month/${data.year}/${data.month}`)
    const response = await processResponse<Array<structs.HistoryItem>>(resp)
    return response || []
  },
}

const Config: ConfigController = {
  async GetConfig() {
    const resp = await fetch(`${window.location.origin}/api/config`)
    const response = await processResponse<structs.ConfigData>(resp)
    return response || {}
  },
  async SaveConfig(data) {
    const resp = await fetch(`${window.location.origin}/api/config`, {
      method: 'put',
      headers,
      body: JSON.stringify(data)
    })
    const response = await processResponse<void>(resp)
    window.document.title = `Miscellaneous - ${data.name}`
    return response
  },
}

const Checkout: CheckoutController = {
  async GetHistory() {
    const resp = await fetch(`${window.location.origin}/api/sales`)
    const response = await processResponse<Array<structs.Sale>>(resp)
    return response || []
  },
  async RestoreHistory(id) {
    const resp = await fetch(`${window.location.origin}/api/sales/${id}`, { headers, method: 'delete' })
    const response = await processResponse<void>(resp)
    return response
  },
  async SaveCheckout(data) {
    const resp = await fetch(`${window.location.origin}/api/sales`, { headers, method: 'put', body: JSON.stringify(data) })
    const response = await processResponse<void>(resp)
    return response
  },
}

const controllers = {
  Auth, Profile, Users, Providers,
  BarCodes, Products, History,
  Config, Checkout
}

Object.defineProperty(window, 'go', { value: { controllers } })

Config
  .GetConfig()
  .then(config => document.title = `Miscellaneous - ${config.name}`)
