import './User'

declare global {
  namespace Miscellaneous {
    interface Session {
      user: Miscellaneous.User
    }
  }
}