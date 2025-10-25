package models

import (
	"Miscellaneous/core/utils"
	"path/filepath"

	"gopkg.in/ini.v1"
)

var Users *UsersModel
var Config *ConfigModel
var Profile *ProfileModel
var Providers *ProvidersModel
var BarCodes *BarCodesModel
var Products *ProductsModel
var Checkout *CheckoutModel
var History *HistoryModel
var configPath string
var configSectionName string

func init() {
	Users = &UsersModel{}
	Config = &ConfigModel{}
	Profile = &ProfileModel{}
	Providers = &ProvidersModel{}
	BarCodes = &BarCodesModel{}
	Products = &ProductsModel{}
	Checkout = &CheckoutModel{}
	History = &HistoryModel{}

	configSectionName = "System"
	configPath = filepath.Join(".", ".data", "miscellaneous.conf")
	if !utils.DirExists(configPath) {
		utils.WriteFile(configPath, "")
	}

	cfg, err := ini.Load(configPath)
	if err != nil {
		panic(err)
	}

	existSystemConfig := cfg.HasSection(configSectionName)
	if !existSystemConfig {
		systemSection, err := cfg.NewSection(configSectionName)
		if err != nil {
			panic(err)
		}

		systemSection.NewKey("name", "Mi tienda")
		systemSection.NewKey("ip printer", "0.0.0.0")

		err = cfg.SaveTo(configPath)
		if err != nil {
			panic(err)
		}
	}
}
