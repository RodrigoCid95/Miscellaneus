import { type FC } from "react"
import { Card, makeStyles, tokens } from "@fluentui/react-components"
import ToolbarPage from "./../../../Components/Toolbar"
import SelectDatePicker from "./SelectDatePicker"
import HistoryList, { emitters } from "./List"

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL,
    overflow: 'auto'
  },
})

const HistoryPage: FC<HistoryPageProps> = ({ onOpenMenu }) => {
  const styles = useStyles()
  
  return (
    <>
      <ToolbarPage title="Historial" onOpenMenu={onOpenMenu}>
        <SelectDatePicker loadHistoryListEmitter={emitters.load} />
      </ToolbarPage>
      <Card className={styles.root}>
        <HistoryList />
      </Card>
    </>
  )
}

export default HistoryPage

interface HistoryPageProps {
  onOpenMenu: () => void
}