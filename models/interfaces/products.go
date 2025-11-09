package interfaces

import "Miscellaneous/models/structs"

type UpdateStockArgs struct {
	Id    string
	Stock int
}

type ProductsModel interface {
	Create(data structs.NewProduct) *structs.CoreError
	GetAll() ([]structs.Product, *structs.CoreError)
	Find(query string) ([]structs.Product, *structs.CoreError)
	Update(data structs.DataProduct) *structs.CoreError
	Delete(id string) *structs.CoreError
}
