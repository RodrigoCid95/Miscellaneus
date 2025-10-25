import { createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const ProvidersContext = createContext<{
  loading: boolean
  loadProviders: () => void
  items: models.Provider[]
}>({
  loading: false,
  loadProviders: () => { },
  items: [],
})

const useProvidersContext = () => useContext(ProvidersContext)

export { ProvidersContext, useProvidersContext }