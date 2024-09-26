import { useEffect, type FC } from "react"
import ToolbarPage from "./../../Components/Toolbar"

const DashboardPage: FC<DashboardPageProps> = ({ onOpenMenu }) => {

  useEffect(() => {
    const date = new Date()
    const nowUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    date.setDate(date.getDate() + 1)
    const tomorrowUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    fetch(`${window.location.origin}/api/history/${nowUTC}/${tomorrowUTC}`)
      .then(res => res.json())
      .then(res => console.log(res))
  }, [])

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