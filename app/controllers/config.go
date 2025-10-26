package controllers

import (
	"Miscellaneous/app"
	"Miscellaneous/core/config"
	"Miscellaneous/core/utils"
)

type Config struct{}

func (c *Config) GetConfig() config.ConfigData {
	data := config.ConfigData{}
	config.Driver.GetData(config.SystemConfigName, &data)
	return data
}

func (c *Config) SaveConfig(data config.ConfigData) error {
	if data.Name == "" || data.IpPrinter == "" {
		return utils.NewError("fields-required", "Faltan parámetros.")
	}

	app.Window.SetTitle("Miscellaneous - " + data.Name)

	config.Driver.PutData(config.SystemConfigName, &data)
	return nil
}
