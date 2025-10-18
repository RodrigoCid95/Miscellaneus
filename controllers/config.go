package controllers

import (
	"Miscellaneous/app"
	"Miscellaneous/models"
	"Miscellaneous/utils"
)

type Config struct{}

func (c *Config) GetConfig() models.ConfigData {
	return *models.Config.LoadConfig()
}

func (c *Config) SaveConfig(config models.ConfigData) error {
	if config.Name == "" || config.IpPrinter == "" {
		return utils.NewError("fields-required", "Faltan parámetros.")
	}

	app.Window.SetTitle("Miscellaneous - " + config.Name)

	models.Config.UpdateConfig(config)
	return nil
}
