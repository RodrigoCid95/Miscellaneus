package controllers

import (
	"Miscellaneous/app"
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type Config struct{}

func (c *Config) GetConfig() (*structs.ConfigData, error) {
	data, err := modules.Config.GetConfig()
	if err != nil {
		return data, errors.ProcessError(err)
	}

	return data, nil
}

func (c *Config) SaveConfig(data structs.ConfigData) error {
	err := modules.Config.SaveConfig(data)
	if err != nil {
		return errors.ProcessError(err)
	}

	app.Window.SetTitle("Miscellaneous - " + data.Name)
	return nil
}
