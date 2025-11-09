package interfaces

import "Miscellaneous/models/structs"

type CheckoutModel interface {
	CreateSale(profile *structs.User, products []structs.CheckoutItem) *structs.CoreError
	GetHistory(profile *structs.User) ([]structs.Sale, *structs.CoreError)
	DeleteSale(profile *structs.User, id string) *structs.CoreError
}
