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
    }
  }
}