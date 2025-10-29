import { createContext, useContext } from 'react'
import { config } from '../../../../wailsjs/go/models'

const ConfigContext = createContext<{
  config?: config.ConfigData
  loadConfig: () => void
  setConfig: (config: config.ConfigData) => Promise<void>
}>({
  loadConfig: () => { },
  setConfig: () => new Promise(resolve => resolve())
})

const useConfigContext = () => useContext(ConfigContext)

export { ConfigContext, useConfigContext }
