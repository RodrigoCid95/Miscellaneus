/// <reference types="vite/client" />

import './../../server/types'

declare global {
  type Callback = (...args: any[]) => void | Promise<void>
  interface Verification {
    message?: string
    state?: 'error' | 'warning' | 'success' | 'none'
  }
  interface Window {
    createBarCode(newBarCode: Miscellaneous.NewBarCode): Promise<void>
    getBarCodes(): Promise<Miscellaneous.BarCode[]>
    updateBarCode(barCode: Miscellaneous.BarCode): Promise<void>
    deleteBarCode(id: Miscellaneous.BarCode['id']): Promise<void>
    saveCheckout(productGroups: Miscellaneous.ProductGroup[]): Promise<void>
    findProducts(query: string): Promise<Miscellaneous.Product[]>
    getConfig(): Promise<Miscellaneous.Config>
    saveConfig(config: Miscellaneous.Config): Promise<void>
    getHistory(): Promise<Miscellaneous.History[]>
    getDayHistory(year: number, month: number, day: number): Promise<Miscellaneous.History[]>
    getWeekHistory(year: number, week: number): Promise<Miscellaneous.History[]>
    getMonthHistory(year: number, month: number): Promise<Miscellaneous.History[]>
    restoreHistory(id: Miscellaneous.History['id']): Promise<void>
    createProduct(newProduct: Miscellaneous.NewProduct): Promise<void>
    getProducts(): Promise<Miscellaneous.Product[]>
    getFilterProducts(query: string): Promise<Miscellaneous.Product[]>
    updateProduct(id: Miscellaneous.Product['id'], product: Miscellaneous.NewProduct): Promise<void>
    deleteProduct(id: Miscellaneous.Product['id']): Promise<void>
    getProfile(): Promise<Miscellaneous.User>
    updateProfile(data: Partial<Miscellaneous.User>): Promise<any>
    getProviders(): Promise<Miscellaneous.Provider[]>
    updateProvider(newProvider: Miscellaneous.Provider): Promise<void>
    deleteProvider(id: Miscellaneous.Provider['id']): Promise<void>
    saveProvider(newProvider: Miscellaneous.NewProvider): Promise<void>
    updatePassword(currentPass: string, newPass: string): Promise<any>
    createUser(newUser: Miscellaneous.NewUser): Promise<any>
    getUsers(): Promise<Miscellaneous.User[]>
    updateUser(id: Miscellaneous.User['id'], user: Partial<Miscellaneous.NewUser>): Promise<any>
    deleteUser(id: Miscellaneous.User['id']): Promise<void>
    login(user_name: string, password: string): Promise<any>
    logout(): Promise<void>
    getBarCodeSrc(id: Miscellaneous.BarCode['id']): Promise<string>
  }
}
