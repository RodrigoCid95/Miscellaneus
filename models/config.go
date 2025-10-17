package models

import "gopkg.in/ini.v1"

type ConfigData struct {
	Name      string `json:"name"`
	IpPrinter string `json:"ipPrinter"`
	Port      string `json:"port"`
}

type ConfigModel struct{}

func (c *ConfigModel) LoadConfig() *ConfigData {
	cfg, err := ini.Load(configPath)
	if err != nil {
		panic(err)
	}

	name := cfg.Section(configSectionName).Key("name").String()
	ipPrinter := cfg.Section(configSectionName).Key("ip printer").String()
	port := cfg.Section(configSectionName).Key("port").String()
	config := ConfigData{
		Name:      name,
		IpPrinter: ipPrinter,
		Port:      port,
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
	cfg.Section(configSectionName).Key("port").SetValue(config.Port)

	err = cfg.SaveTo(configPath)
	if err != nil {
		panic(err)
	}
}
