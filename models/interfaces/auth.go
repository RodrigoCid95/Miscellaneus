package interfaces

import "Miscellaneous/models/structs"

type LoginArgs struct {
	UserName string
	Password string
}

type AuthModel interface {
	Login(LoginArgs) (*structs.User, *structs.CoreError)
}
