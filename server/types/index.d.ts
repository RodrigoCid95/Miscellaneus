import './BarCodes'
import './History'
import './Products'
import './Providers'
import './Sales'
import './User'

declare global {
  namespace Miscellaneous {
    interface Session {
      user: Miscellaneous.User
      config?: Config
    }
    interface Config {
      name: string
      ipPrinter: string
    }
    type ConfigResult = {
      key: keyof Miscellaneous.Config
      value: Miscellaneous.Config[keyof Miscellaneous.Config]
    }
    interface ITimeUTC {
      getCurrentUTC(): number;
      getStartAndEndOfWeek(year: number, week: number): { start: number; end: number };
      getStartAndEndOfDay(year: number, month: number, day: number): { start: number; end: number };
      getStartAndEndOfMonth(year: number, month: number): { start: number; end: number };
      getStartAndEndOfYear(year: number): { start: number; end: number };
    }
  }
  const timeUTC: Miscellaneous.ITimeUTC
}