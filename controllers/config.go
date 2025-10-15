package controllers

import (
	"Miscellaneous/models"
	"Miscellaneous/utils"
	"context"
)

type Config struct {
	ctx *context.Context
}

func (c *Config) OnStartup(ctx context.Context) {
	c.ctx = &ctx
}

func (c *Config) GetConfig() models.ConfigData {
	return *models.Config.LoadConfig()
}

func (c *Config) SaveConfig(config models.ConfigData) error {
	if config.Name == "" || config.IpPrinter == "" {
		return utils.NewError("fields-required", "Faltan parámetros.")
	}

	Window.SetTitle("Miscellaneous - " + config.Name)

	models.Config.UpdateConfig(config)
	return nil
}
