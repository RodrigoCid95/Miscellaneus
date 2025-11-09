package interfaces

import "Miscellaneous/models/structs"

type ConfigModel interface {
	GetConfig() (*structs.ConfigData, *structs.CoreError)
	SaveConfig(data structs.ConfigData) *structs.CoreError
}
