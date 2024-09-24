import { FC } from "react"
import ToolbarPage from "../../components/Toolbar"
import { ToolbarButton } from "@fluentui/react-components"
import ProviderList, { loadProvidersEmitter } from "./List"
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from "@fluentui/react-icons"
import NewProvider from "./New"

const ReloadIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular)

const ProvidersPage: FC<ProvidersPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Proveedores" onOpenMenu={onOpenMenu}>
        <NewProvider />
        <ToolbarButton
          appearance="transparent"
          icon={<ReloadIcon />}
          onClick={() => loadProvidersEmitter.emit()}
        />
      </ToolbarPage>
      <ProviderList />
    </>
  )
}

export default ProvidersPage

interface ProvidersPageProps {
  onOpenMenu: () => void
}