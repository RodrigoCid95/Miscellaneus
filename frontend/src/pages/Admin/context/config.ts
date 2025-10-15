import { createContext, useContext } from 'react'
import { models } from '../../../../wailsjs/go/models'

const ConfigContext = createContext<{
  config?: models.ConfigData
  loadConfig: () => void
  setConfig: (config: models.ConfigData) => Promise<void>
}>({
  loadConfig: () => { },
  setConfig: () => new Promise(resolve => resolve())
})

const useConfigContext = () => useContext(ConfigContext)

export { ConfigContext, useConfigContext }
