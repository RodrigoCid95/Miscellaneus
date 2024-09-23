import { type FC } from "react"
import ToolbarPage from "../components/Toolbar"

const DashboardPage: FC<DashboardPageProps> = ({ onOpenMenu }) => {
  return (
    <>
      <ToolbarPage title="Inicio" onOpenMenu={onOpenMenu} />
    </>
  )
}

export default DashboardPage

interface DashboardPageProps {
  onOpenMenu(): void
}