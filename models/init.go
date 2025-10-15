package models

import (
	"os"

	"gopkg.in/ini.v1"
)

var Users *UsersModel
var Config *ConfigModel
var Profile *ProfileModel
var Providers *ProvidersModel
var BarCodes *BarCodesModel
var Products *ProductsModel
var Checkout *CheckoutModel
var Hostory *HistoryModel

const configPath = "./miscellaneous.conf"
const configSectionName = "System"

func init() {
	Users = &UsersModel{}
	Config = &ConfigModel{}
	Profile = &ProfileModel{}
	Providers = &ProvidersModel{}
	BarCodes = &BarCodesModel{}
	Products = &ProductsModel{}
	Checkout = &CheckoutModel{}
	Hostory = &HistoryModel{}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		file, err := os.Create(configPath)
		if err != nil {
			panic(err)
		}
		defer file.Close()
		file.WriteString("")
		err = os.Chmod(configPath, 0600)
		if err != nil {
			panic(err)
		}
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
