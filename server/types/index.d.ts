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
  }
}