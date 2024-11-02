import { useEffect, useState } from "react"
import { BarCodesContext, useBarCodesContext } from "../../../context/barcodes"
import ToolbarPage from "../../../components/Toolbar"
import List from './List'
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import NewBarcode from "./New"

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
  const [items, setItems] = useState<Miscellaneous.BarCode[]>([])

  const loadBarCodes = () => {
    setLoading(true)
    window.getBarCodes()
      .then(barcodes => {
        setItems(barcodes)
        setLoading(false)
      })
  }

  useEffect(loadBarCodes, [])

  return (
    <BarCodesContext.Provider value={{ loading, loadBarCodes, items }}>
      <BarCodes />
    </BarCodesContext.Provider>
  )
}