package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/utils/config"
)

var systemConfigName = "System"

type ConfigModule struct {
	interfaces.ConfigModel
}

func (cm ConfigModule) GetConfig() (*structs.ConfigData, *structs.CoreError) {
	data := structs.ConfigData{}
	config.ConfigController.GetData(systemConfigName, &data)
	return &data, nil
}

func (cm ConfigModule) SaveConfig(data structs.ConfigData) *structs.CoreError {
	if data.Name == "" || data.IpPrinter == "" {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "fields-required",
			Message:    "Faltan parámetros.",
		}
	}

	config.ConfigController.PutData(systemConfigName, data)
	return nil
}
