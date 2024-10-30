import { useEffect, useState } from "react"
import { Card, makeStyles, tokens } from "@fluentui/react-components"
import { DateRangeType } from '@fluentui/react-calendar-compat'
import ToolbarPage from "../../../components/Toolbar"
import { HistoryContext } from './../../../context/adminHistory'
import { getDayHistory, getMonthHistory, getWeekHistory, restoreHistory } from "../../../services/history"
import SelectDatePicker from "./SelectDatePicker"
import HistoryList from "./List"

const useStyles = makeStyles({
  root: {
    marginTop: tokens.spacingVerticalXXL,
    overflow: 'auto'
  }
})

const History = () => {
  const styles = useStyles()

  return (
    <>
      <ToolbarPage title="Historial">
        <SelectDatePicker />
      </ToolbarPage>
      <Card className={styles.root}>
        <HistoryList />
      </Card>
    </>
  )
}

export default () => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Miscellaneous.History[]>([])
  const [selection, setSelection] = useState<{
    type: DateRangeType
    data: number[]
  }>()

  const loadItems = (type: DateRangeType, data: number[]) => {
    if (type === DateRangeType.Day) {
      const [year, month, day] = data
      setLoading(true)
      setSelection({ type, data })
      getDayHistory(year, month, day).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
    if (type === DateRangeType.Week) {
      const [year, week] = data
      setLoading(true)
      setSelection({ type, data })
      getWeekHistory(year, week).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
    if (type === DateRangeType.Month) {
      const [year, month] = data
      setLoading(true)
      setSelection({ type, data })
      getMonthHistory(year, month).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
  }

  const removeItem = (id: Miscellaneous.History['id']) => {
    if (selection) {
      const { type, data } = selection
      restoreHistory(id).then(() => loadItems(type, data))
    }
  }

  useEffect(() => {
    const date = new Date()
    loadItems(DateRangeType.Day, [date.getFullYear(), date.getMonth() + 1, date.getDate()])
  }, [])

  return (
    <HistoryContext.Provider value={{ loading, items, loadItems, removeItem }}>
      <History />
    </HistoryContext.Provider>
  )
}