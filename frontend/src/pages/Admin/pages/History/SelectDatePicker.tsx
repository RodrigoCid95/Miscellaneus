import { type FC, useState } from "react"
import { Field, Dropdown, Option } from '@fluentui/react-components'
import { DateRangeType } from '@fluentui/react-calendar-compat'
import { type CalendarStrings, DatePicker, defaultDatePickerStrings } from "@fluentui/react-datepicker-compat"
import { useHistory } from "../../context/history"

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

const dateRangeOptions = {
  'Día': DateRangeType.Day,
  'Semana': DateRangeType.Week,
  'Mes': DateRangeType.Month,
}

const titles = {
  'Día': 'Selecciona un día',
  'Semana': 'Selecciona una semana',
  'Mes': 'Selecciona un mes',
}

const onFormatDate = (date?: Date) => {
  return !date
    ? ""
    : `${localizedStrings.months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
}

const SelectDatePicker: FC<SelectDatePickerProps> = () => {
  const { loadItems } = useHistory()
  const [dateRangeType, setDateRangeType] = useState('Día')
  const [date, setDate] = useState<Date | null>(new Date())

  const handleOnSelectDate = (date: Date | null | undefined) => {
    if (date) {
      setDate(date)
      const selection = dateRangeOptions[dateRangeType as keyof typeof dateRangeOptions]
      let data: number[] = []
      if (selection === DateRangeType.Day) {
        data = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      }
      if (selection === DateRangeType.Week) {
        const startOfYear = new Date(date.getFullYear(), 0, 1)
        const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        const firstSunday = new Date(startOfYear)
        firstSunday.setDate(startOfYear.getDate() + (7 - startOfYear.getDay()) % 7)
        const week = Math.floor((daysSinceStart + firstSunday.getDay()) / 7) + 1
        data = [date.getFullYear(), week]
      }
      if (selection === DateRangeType.Month) {
        data = [date.getFullYear(), date.getMonth() + 1]
      }
      loadItems(selection, data)
    }
  }

  return (
    <>
      <Field
        label='Rango'
      >
        <Dropdown
          onOptionSelect={(_, data) => setDateRangeType(data.optionValue as any)}
          defaultValue='Día'
        >
          {Object.keys(dateRangeOptions).map((key) => (
            <Option key={key}>{key}</Option>
          ))}
        </Dropdown>
      </Field>
      <Field
        label={titles[dateRangeType as keyof typeof titles]}
      >
        <DatePicker
          calendar={{ dateRangeType: dateRangeOptions[dateRangeType as keyof typeof dateRangeOptions] }}
          strings={localizedStrings}
          formatDate={onFormatDate}
          value={date}
          maxDate={new Date()}
          onSelectDate={handleOnSelectDate}
        />
      </Field>
    </>
  )
}

export default SelectDatePicker

interface SelectDatePickerProps {
}
