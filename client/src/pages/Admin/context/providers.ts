import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const ProvidersContext = createContext<{
  loading: boolean
  loadProviders: () => void
  items: structs.Provider[]
}>({
  loading: false,
  loadProviders: () => { },
  items: [],
})

const useProvidersContext = () => useContext(ProvidersContext)

export { ProvidersContext, useProvidersContext }