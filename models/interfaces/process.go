package interfaces

import "Miscellaneous/models/structs"

type ProcessModel interface {
	Kill() *structs.CoreError
}
