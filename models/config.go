package models

import "gopkg.in/ini.v1"

type ConfigData struct {
	Name      string `json:"name"`
	IpPrinter string `json:"ipPrinter"`
}

type ConfigModel struct{}

func (c *ConfigModel) LoadConfig() *ConfigData {
	cfg, err := ini.Load(configPath)
	if err != nil {
		panic(err)
	}

	name := cfg.Section(configSectionName).Key("name").String()
	ipPrinter := cfg.Section(configSectionName).Key("ip printer").String()
	config := ConfigData{
		Name:      name,
		IpPrinter: ipPrinter,
	}

	return &config
}

func (c *ConfigModel) UpdateConfig(config ConfigData) {
	cfg, err := ini.Load(configPath)
	if err != nil {
		panic(err)
	}

	cfg.Section(configSectionName).Key("name").SetValue(config.Name)
	cfg.Section(configSectionName).Key("ip printer").SetValue(config.IpPrinter)

	err = cfg.SaveTo(configPath)
	if err != nil {
		panic(err)
	}
}
