import { useEffect, useState } from "react"
import { BarCodesContext, useBarCodesContext } from "../../context/barcodes"
import ToolbarPage from "../../components/Toolbar"
import List from './components/List'
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import NewBarcode from "./components/New"
import { structs } from "../../../../../wailsjs/go/models"
import { GetBarCodes } from "../../../../../wailsjs/go/controllers/BarCodes"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const BarCodes = () => {
  const { loadBarCodes } = useBarCodesContext()

  return (
    <>
      <ToolbarPage title="Códigos de barras">
        <NewBarcode />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={loadBarCodes}
        />
      </ToolbarPage>
      <List />
    </>
  )
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [items, setItems] = useState<structs.BarCode[]>([])

  const loadBarCodes = () => {
    setLoading(true)
    GetBarCodes()
      .then(barcodes => setItems(barcodes))
      .catch(error => {
        console.error(error)
        setItems([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadBarCodes, [])

  return (
    <BarCodesContext.Provider value={{ loading, loadBarCodes, items }}>
      <BarCodes />
    </BarCodesContext.Provider>
  )
}