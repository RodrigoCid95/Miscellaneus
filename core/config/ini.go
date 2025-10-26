package config

import (
	"Miscellaneous/core/utils"
	"path/filepath"
)

var configPath string
var SystemConfigName string
var Driver *ConfigDriver

func init() {
	SystemConfigName = "System"
	configPath = filepath.Join(".", ".data", "miscellaneous.conf")
	if !utils.DirExists(configPath) {
		utils.WriteFile(configPath, "")
	}

	Driver = &ConfigDriver{}

	hasSystemSection := Driver.HasSection(SystemConfigName)
	if !hasSystemSection {
		Driver.PutData(SystemConfigName, &ConfigData{
			Name:      "Mi Tienda",
			IpPrinter: "0.0.0.0",
		})
	}
}
