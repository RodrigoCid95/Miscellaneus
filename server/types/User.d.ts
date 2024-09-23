declare global {
  namespace Miscellaneous {
    interface User {
      id: number
      name: string
      userName: string
      isAdmin: boolean
    }
    interface NewUser extends Omit<User, 'id'> {
      password: string
    }
    interface UserResult {
      rowid: number
      name: string
      user_name: string
      is_admin: number
      hash: string
    }
  }
}

export { }