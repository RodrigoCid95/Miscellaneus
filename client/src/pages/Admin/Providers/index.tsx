import { useEffect, useState } from "react"
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import { ProvidersContext, useProvidersContext } from "../../../context/providers"
import ToolbarPage from "../../../components/Toolbar"
import New from './New'
import List from './List'

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const Providers = () => {
  const { loadProviders } = useProvidersContext()

  return (
    <>
      <ToolbarPage title="Proveedores">
        <New />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={loadProviders}
        />
      </ToolbarPage>
      <List />
    </>
  )
}

export default () => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Miscellaneous.Provider[]>([])

  const loadProviders = () => {
    setLoading(true)
    window.getProviders()
      .then(providers => {
        setItems(providers)
        setLoading(false)
      })
  }

  useEffect(loadProviders, [])

  return (
    <ProvidersContext.Provider value={{ loading, loadProviders, items }}>
      <Providers />
    </ProvidersContext.Provider>
  )
}