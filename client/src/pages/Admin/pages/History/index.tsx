import { useEffect, useState } from "react"
import { DateRangeType } from '@fluentui/react-calendar-compat'
import ToolbarPage from "../../components/Toolbar"
import { HistoryContext } from '../../context/history'
import SelectDatePicker from "./SelectDatePicker"
import HistoryList from "./List"
import { controllers, structs } from "../../../../../wailsjs/go/models"
import { RestoreHistory } from "../../../../../wailsjs/go/controllers/Checkout"
import { GetDayHistory, GetWeekHistory, GetMonthHistory } from '../../../../../wailsjs/go/controllers/History'

const History = () => (
  <>
    <ToolbarPage title="Historial">
      <SelectDatePicker />
    </ToolbarPage>
    <HistoryList />
  </>
)

export default () => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<structs.HistoryItem[]>([])
  const [selection, setSelection] = useState<{
    type: DateRangeType
    data: number[]
  }>()

  const loadItems = (type: DateRangeType, data: number[]) => {
    if (type === DateRangeType.Day) {
      const [year, month, day] = data
      setLoading(true)
      setSelection({ type, data })
      const arg = new structs.DataDay()
      arg.year = year
      arg.month = month
      arg.day = day
      GetDayHistory(arg).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
    if (type === DateRangeType.Week) {
      const [year, week] = data
      setLoading(true)
      setSelection({ type, data })
      const arg = new structs.DataWeek()
      arg.year = year
      arg.week = week
      GetWeekHistory(arg).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
    if (type === DateRangeType.Month) {
      const [year, month] = data
      setLoading(true)
      setSelection({ type, data })
      const arg = new structs.DataMonth()
      arg.year = year
      arg.month = month
      GetMonthHistory(arg).then(items => {
        setItems(items)
        setLoading(false)
      })
      return
    }
  }

  const removeItem = (id: structs.HistoryItem['id']) => {
    if (selection) {
      const { type, data } = selection
      RestoreHistory(id).then(() => loadItems(type, data))
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
