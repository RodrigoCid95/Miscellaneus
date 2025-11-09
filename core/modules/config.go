package modules

import (
	"Miscellaneous/core/driver"
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
)

type ConfigModule struct {
	interfaces.ConfigModel
}

func (cm ConfigModule) GetConfig() (*structs.ConfigData, *structs.CoreError) {
	data := structs.ConfigData{}
	driver.ConfigDriver.GetData("System", &data)
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

	driver.ConfigDriver.PutData("System", data)
	return nil
}
