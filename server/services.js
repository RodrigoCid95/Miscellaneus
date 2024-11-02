//#region BarCodes
const createBarCode = async newBarCode => {
  await fetch('/api/bar-codes', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newBarCode)
  })
}

const getBarCodes = async () => {
  const response = await fetch('/api/bar-codes')
  const barcodes = await response.json()
  return barcodes
}

const updateBarCode = async barCode => {
  await fetch('api/bar-codes', {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(barCode)
  })
}

const deleteBarCode = async id => {
  await fetch(`/api/bar-codes/${id}`, {
    method: 'delete'
  })
}
//#endregion BarCodes
//#region Products
const saveCheckout = async productGroups => {
  const newSales = []
  for (const product of productGroups) {
    newSales.push({
      product: product.id,
      count: product.count,
      total: product.price * product.count
    })
  }
  await fetch('/api/sales', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSales)
  })
}

const findProducts = async query => {
  const products = await fetch(`/api/products/${query}`)
    .then(res => res.json())
  return products
}
//#endregion Products
//#region Config
const getConfig = async () => {
  const config = await fetch('/api/config')
    .then(res => res.json())
  return config
}

const saveConfig = async config => {
  await fetch('/api/config', {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(config)
  })
}
//#endregion Config
//#region History
const getHistory = async () => {
  const response = await fetch('/api/history')
  const results = await response.json()
  return results
}

const getDayHistory = async (year, month, day) => {
  const response = await fetch(`/api/history/day/${year}/${month}/${day}`)
  const results = await response.json()
  return results
}

const getWeekHistory = async (year, week) => {
  const response = await fetch(`/api/history/week/${year}/${week}`)
  const results = await response.json()
  return results
}

const getMonthHistory = async (year, month) => {
  const response = await fetch(`/api/history/month/${year}/${month}`)
  const results = await response.json()
  return results
}

const restoreHistory = async id => {
  await fetch(`/api/history/${id}`, {
    method: 'delete'
  })
}
//#endregion History
//#region Products
const createProduct = async newProduct => {
  fetch(`${window.location.origin}/api/products`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  })
}

const getProducts = async () => {
  const response = await fetch('/api/products')
  const results = await response.json()
  return results
}

const getFilterProducts = async query => {
  const response = await fetch(`/api/products/${query}`)
  const results = await response.json()
  return results
}

const updateProduct = async (id, product) => {
  await fetch('/api/products', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...product })
  })
}

const deleteProduct = async id => {
  await fetch(`/api/products/${id}`, {
    method: 'delete'
  })
}
//#endregion Products
//#region Profile
const getProfile = async () => {
  const response = await fetch('/api/profile')
  const profile = await response.json()
  return profile
}

const updateProfile = async data => {
  const response = await fetch(`${window.location.origin}/api/profile`, {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  })
  return await response.json()
}
//#endregion Profile
//#region Providers
const getProviders = async () => {
  const response = await fetch('api/providers')
  const items = await response.json()
  return items
}

const updateProvider = async newProvider => {
  await fetch('/api/providers', {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newProvider)
  })
}

const deleteProvider = async id => {
  await fetch(`/api/providers/${id}`, {
    method: 'delete'
  })
}

const saveProvider = async newProvider => {
  await fetch('/api/providers', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newProvider)
  })
}
//#endregion Providers
//#region UpdatePassword
const updatePassword = async (currentPass, newPass) => {
  const res = await fetch(`${window.location.origin}/api/profile`, {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ currentPass, newPass })
  })
  return await res.json()
}
//#endregion UpdatePassword
//#region Users
const createUser = async newUser => {
  const response = await fetch('/api/users', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  return await response.json()
}

const getUsers = async () => {
  const response = await fetch('/api/users')
  const results = await response.json()
  return results
}

const updateUser = async (id, user) => {
  const response = await fetch('/api/users', {
    method: 'put',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ id, ...user })
  })
  return await response.json()
}

const deleteUser = async id => {
  await fetch(`/api/users/${id}`, {
    method: 'delete'
  })
}
//#endregion Users
//#region Auth
const login = async (user_name, password) => {
  const response = await fetch('/api/auth', {
    method: 'post',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ user_name, password })
  })
  const result = await response.json()
  return result
}
const logout = async () => {
  await fetch('/api/auth', {
    method: 'delete'
  })
}
//#endregion Auth

Object.defineProperty(window, 'createBarCode', { value: createBarCode, writable: false })
Object.defineProperty(window, 'getBarCodes', { value: getBarCodes, writable: false })
Object.defineProperty(window, 'updateBarCode', { value: updateBarCode, writable: false })
Object.defineProperty(window, 'deleteBarCode', { value: deleteBarCode, writable: false })
Object.defineProperty(window, 'saveCheckout', { value: saveCheckout, writable: false })
Object.defineProperty(window, 'findProducts', { value: findProducts, writable: false })
Object.defineProperty(window, 'getConfig', { value: getConfig, writable: false })
Object.defineProperty(window, 'saveConfig', { value: saveConfig, writable: false })
Object.defineProperty(window, 'getHistory', { value: getHistory, writable: false })
Object.defineProperty(window, 'getDayHistory', { value: getDayHistory, writable: false })
Object.defineProperty(window, 'getWeekHistory', { value: getWeekHistory, writable: false })
Object.defineProperty(window, 'getMonthHistory', { value: getMonthHistory, writable: false })
Object.defineProperty(window, 'restoreHistory', { value: restoreHistory, writable: false })
Object.defineProperty(window, 'createProduct', { value: createProduct, writable: false })
Object.defineProperty(window, 'getProducts', { value: getProducts, writable: false })
Object.defineProperty(window, 'getFilterProducts', { value: getFilterProducts, writable: false })
Object.defineProperty(window, 'updateProduct', { value: updateProduct, writable: false })
Object.defineProperty(window, 'deleteProduct', { value: deleteProduct, writable: false })
Object.defineProperty(window, 'getProfile', { value: getProfile, writable: false })
Object.defineProperty(window, 'updateProfile', { value: updateProfile, writable: false })
Object.defineProperty(window, 'getProviders', { value: getProviders, writable: false })
Object.defineProperty(window, 'updateProvider', { value: updateProvider, writable: false })
Object.defineProperty(window, 'deleteProvider', { value: deleteProvider, writable: false })
Object.defineProperty(window, 'saveProvider', { value: saveProvider, writable: false })
Object.defineProperty(window, 'updatePassword', { value: updatePassword, writable: false })
Object.defineProperty(window, 'createUser', { value: createUser, writable: false })
Object.defineProperty(window, 'getUsers', { value: getUsers, writable: false })
Object.defineProperty(window, 'updateUser', { value: updateUser, writable: false })
Object.defineProperty(window, 'deleteUser', { value: deleteUser, writable: false })
Object.defineProperty(window, 'login', { value: login, writable: false })
Object.defineProperty(window, 'logout', { value: logout, writable: false })