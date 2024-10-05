import { type FC } from "react"
import ToolbarPage from "./../../../Components/Toolbar"
import { ToolbarButton } from "@fluentui/react-components"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import NewBarcode from "./New"
import BarCodeList, { loadBarCodeListEmitter } from "./List"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const BarCodesPage: FC<BarCodesPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Códigos de barras" onOpenMenu={onOpenMenu}>
        <NewBarcode />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={() => loadBarCodeListEmitter.emit()}
        />
      </ToolbarPage>
      <BarCodeList />
    </>
  )
}

export default BarCodesPage

interface BarCodesPageProps {
  onOpenMenu: () => void
}