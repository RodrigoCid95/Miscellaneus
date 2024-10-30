import { createContext, useContext } from 'react'

const ConfigContext = createContext<{
  config?: Miscellaneous.Config
  loadConfig: () => void
  setConfig: (config: Miscellaneous.Config) => Promise<void>
}>({
  loadConfig: () => { },
  setConfig: () => new Promise(resolve => resolve())
})

const useConfigContext = () => useContext(ConfigContext)

export { ConfigContext, useConfigContext }