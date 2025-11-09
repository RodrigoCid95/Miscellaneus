import { createContext, useContext } from 'react'
import { structs } from '../../../../wailsjs/go/models'

const ConfigContext = createContext<{
  config?: structs.ConfigData
  loadConfig: () => void
  setConfig: (config: structs.ConfigData) => Promise<void>
}>({
  loadConfig: () => { },
  setConfig: () => new Promise(resolve => resolve())
})

const useConfigContext = () => useContext(ConfigContext)

export { ConfigContext, useConfigContext }
