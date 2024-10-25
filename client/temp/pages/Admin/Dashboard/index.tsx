import { type FC } from "react"
import ToolbarPage from "./../../../Components/Toolbar"
import Board from "./Board"

const DashboardPage: FC<DashboardPageProps> = ({ onOpenMenu }) => (
  <>
    <ToolbarPage title="Inicio" onOpenMenu={onOpenMenu} />
    <Board />
  </>
)

export default DashboardPage

interface DashboardPageProps {
  onOpenMenu(): void
}