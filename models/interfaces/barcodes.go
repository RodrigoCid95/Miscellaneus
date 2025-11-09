package interfaces

import (
	"Miscellaneous/models/structs"
)

type BarCodesModel interface {
	Create(data structs.NewBarCode) *structs.CoreError
	GetAll() ([]structs.BarCode, *structs.CoreError)
	Update(data structs.BarCode) *structs.CoreError
	Delete(id string) *structs.CoreError
	GetSrc(id string) (string, *structs.CoreError)
}
