import { createContext, useContext } from 'react'

const ProvidersContext = createContext<{
  loading: boolean
  loadProviders: () => void
  items: Miscellaneous.Provider[]
}>({
  loading: false,
  loadProviders: () => { },
  items: [],
})

const useProvidersContext = () => useContext(ProvidersContext)

export { ProvidersContext, useProvidersContext }