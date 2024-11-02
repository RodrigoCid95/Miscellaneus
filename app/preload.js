// preload.js
const { contextBridge, ipcRenderer } = require('electron')

//#region BarCodes
const createBarCode = newBarCode =>
  ipcRenderer.invoke('worker', 'bar-codes:create', newBarCode)

const getBarCodes = () =>
  ipcRenderer.invoke('worker', 'bar-codes:get')

const updateBarCode = barCode =>
  ipcRenderer.invoke('worker', 'bar-codes:update', barCode)

const deleteBarCode = id =>
  ipcRenderer.invoke('worker', 'bar-codes:delete', id)

const getBarCodeSrc = id =>
  ipcRenderer.invoke('worker', 'bar-codes:getSrc', id)
//#endregion BarCodes
//#region Products
const saveCheckout = async productGroups => {
  const user = JSON.parse(localStorage.getItem('user'))
  const newSales = []
  for (const product of productGroups) {
    newSales.push({
      product: product.id,
      count: product.count,
      total: product.price * product.count
    })
  }
  await ipcRenderer.invoke('worker', 'sales:create', newSales, user.id)
}

const findProducts = query =>
  ipcRenderer.invoke('worker', 'products:find', query)
//#endregion Products
//#region Config
const getConfig = () =>
  ipcRenderer.invoke('worker', 'config:get')

const saveConfig = config =>
  ipcRenderer.invoke('worker', 'config:set', config)
//#endregion Config
//#region History
const getHistory = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'history:getToDay', user)
}

const getDayHistory = (year, month, day) => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'history:getFromDay', user, year, month, day)
}

const getWeekHistory = (year, week) => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'history:getFromWeek', user, year, week)
}

const getMonthHistory = (year, month) => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'history:getFromMonth', user, year, month)
}

const restoreHistory = id => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'history:restore', user, id)
}
//#endregion History
//#region Products
const createProduct = newProduct =>
  ipcRenderer.invoke('worker', 'products:create', newProduct)

const getProducts = () =>
  ipcRenderer.invoke('worker', 'products:get')

const getFilterProducts = findProducts

const updateProduct = (id, product) =>
  ipcRenderer.invoke('worker', 'products:update', id, product)

const deleteProduct = id =>
  ipcRenderer.invoke('worker', 'products:delete', id)
//#endregion Products
//#region Profile
const getProfile = async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const profile = await ipcRenderer.invoke('worker', 'profile:get', user.userName)
  localStorage.setItem('user', JSON.stringify(profile))
  return profile
}

const updateProfile = async data => {
  const result = await ipcRenderer.invoke('worker', 'profile:update', data)
  if (result.ok) {
    localStorage.setItem('user', JSON.stringify(data))
  }
  return result
}
//#endregion Profile
//#region Providers
const getProviders = () =>
  ipcRenderer.invoke('worker', 'providers:get')

const updateProvider = newProvider =>
  ipcRenderer.invoke('worker', 'providers:update', newProvider)

const deleteProvider = id => ipcRenderer.invoke('worker', 'providers:delete', id)

const saveProvider = newProvider =>
  ipcRenderer.invoke('worker', 'providers:create', newProvider)
//#endregion Providers
//#region UpdatePassword
const updatePassword = (currentPass, newPass) => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'profile:updatePassword', user, currentPass, newPass)
}
//#endregion UpdatePassword
//#region Users
const createUser = newUser =>
  ipcRenderer.invoke('worker', 'users:create', newUser)

const getUsers = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return ipcRenderer.invoke('worker', 'users:get', user.id)
}

const updateUser = (id, user) =>
  ipcRenderer.invoke('worker', 'users:update', { ...user,id })

const deleteUser = id =>
  ipcRenderer.invoke('worker', 'users:delete', id)
//#endregion Users
//#region Auth
const login = async (user_name, password) => {
  const result = await ipcRenderer.invoke('worker', 'auth:login', user_name, password)
  if (result.ok === undefined) {
    localStorage.setItem('user', JSON.stringify(result))
    return { ok: true }
  }
  return result
}
const logout = () => new Promise(resolve => {
  localStorage.clear()
  resolve()
})
//#endregion Auth

contextBridge.exposeInMainWorld('createBarCode', createBarCode)
contextBridge.exposeInMainWorld('getBarCodes', getBarCodes)
contextBridge.exposeInMainWorld('updateBarCode', updateBarCode)
contextBridge.exposeInMainWorld('deleteBarCode', deleteBarCode)
contextBridge.exposeInMainWorld('getBarCodeSrc', getBarCodeSrc)
contextBridge.exposeInMainWorld('saveCheckout', saveCheckout)
contextBridge.exposeInMainWorld('findProducts', findProducts)
contextBridge.exposeInMainWorld('getConfig', getConfig)
contextBridge.exposeInMainWorld('saveConfig', saveConfig)
contextBridge.exposeInMainWorld('getHistory', getHistory)
contextBridge.exposeInMainWorld('getDayHistory', getDayHistory)
contextBridge.exposeInMainWorld('getWeekHistory', getWeekHistory)
contextBridge.exposeInMainWorld('getMonthHistory', getMonthHistory)
contextBridge.exposeInMainWorld('restoreHistory', restoreHistory)
contextBridge.exposeInMainWorld('createProduct', createProduct)
contextBridge.exposeInMainWorld('getProducts', getProducts)
contextBridge.exposeInMainWorld('getFilterProducts', getFilterProducts)
contextBridge.exposeInMainWorld('updateProduct', updateProduct)
contextBridge.exposeInMainWorld('deleteProduct', deleteProduct)
contextBridge.exposeInMainWorld('getProfile', getProfile)
contextBridge.exposeInMainWorld('updateProfile', updateProfile)
contextBridge.exposeInMainWorld('getProviders', getProviders)
contextBridge.exposeInMainWorld('updateProvider', updateProvider)
contextBridge.exposeInMainWorld('deleteProvider', deleteProvider)
contextBridge.exposeInMainWorld('saveProvider', saveProvider)
contextBridge.exposeInMainWorld('updatePassword', updatePassword)
contextBridge.exposeInMainWorld('createUser', createUser)
contextBridge.exposeInMainWorld('getUsers', getUsers)
contextBridge.exposeInMainWorld('updateUser', updateUser)
contextBridge.exposeInMainWorld('deleteUser', deleteUser)
contextBridge.exposeInMainWorld('login', login)
contextBridge.exposeInMainWorld('logout', logout)