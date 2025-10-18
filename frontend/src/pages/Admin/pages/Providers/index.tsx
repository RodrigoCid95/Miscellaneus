import { useEffect, useState } from "react"
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import { ProvidersContext, useProvidersContext } from "../../context/providers"
import ToolbarPage from "../../components/Toolbar"
import New from './components/New'
import List from './components/List'
import { models } from "../../../../../wailsjs/go/models"
import { GetProviders } from "../../../../../wailsjs/go/controllers/Providers"

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
  const [items, setItems] = useState<models.Provider[]>([])

  const loadProviders = () => {
    setLoading(true)
    GetProviders()
      .then(providers => setItems(providers))
      .catch(error => {
        console.error(error)
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadProviders, [])

  return (
    <ProvidersContext.Provider value={{ loading, loadProviders, items }}>
      <Providers />
    </ProvidersContext.Provider>
  )
}