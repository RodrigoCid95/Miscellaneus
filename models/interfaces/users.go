package interfaces

import "Miscellaneous/models/structs"

type UsersModel interface {
	Create(newUser structs.NewUser) *structs.CoreError
	GetAll(profile *structs.User) ([]structs.User, *structs.CoreError)
	Update(user structs.User) *structs.CoreError
	Delete(id string) *structs.CoreError
}
