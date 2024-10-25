import { type FC, useCallback, useState } from "react"
import { type Emitter } from "../../../utils/Emitters"
import { type CalendarStrings, DatePicker, defaultDatePickerStrings } from "@fluentui/react-datepicker-compat"

const localizedStrings: CalendarStrings = {
  ...defaultDatePickerStrings,
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  shortDays: ["D", "L", "M", "M", "J", "V", "S"],
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],

  shortMonths: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  goToToday: "Ir a hoy",
}

const onFormatDate = (date?: Date) => {
  return !date
    ? ""
    : `${localizedStrings.months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
}

const SelectDatePicker: FC<SelectDatePickerProps> = ({ loadHistoryListEmitter }) => {
  const [date, setDate] = useState<Date | null>(null)

  const handleOnSelectDate = useCallback((date: Date | null | undefined) => {
    if (date) {
      setDate(date)
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0, 0)
      const startUTC = Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
      newDate.setDate(newDate.getDate() + 1)
      const endYear = newDate.getFullYear()
      const endMonth = newDate.getMonth()
      const endDay = newDate.getDate()
      const endUTC = Date.UTC(endYear, endMonth, endDay, newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
      loadHistoryListEmitter.emit([startUTC, endUTC])
    }
  }, [setDate, loadHistoryListEmitter])

  return (
    <DatePicker
      strings={localizedStrings}
      formatDate={onFormatDate}
      placeholder="Selecciona una fecha..."
      value={date}
      maxDate={new Date()}
      onSelectDate={handleOnSelectDate}
    />
  )
}

export default SelectDatePicker

interface SelectDatePickerProps {
  loadHistoryListEmitter: Emitter
}