import './User'
import './BarCodes'
import './Products'
import './Providers'

declare global {
  namespace Miscellaneous {
    interface Session {
      user: Miscellaneous.User
    }
  }
}