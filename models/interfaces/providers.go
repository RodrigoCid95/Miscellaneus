package interfaces

import "Miscellaneous/models/structs"

type ProvidersModel interface {
	Create(data structs.NewProvider) *structs.CoreError
	GetAll() ([]structs.Provider, *structs.CoreError)
	Update(data structs.Provider) *structs.CoreError
	Delete(id string) *structs.CoreError
}
