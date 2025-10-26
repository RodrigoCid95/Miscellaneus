package config

import "gopkg.in/ini.v1"

type ConfigData struct {
	Name      string `ini:"name" json:"name"`
	IpPrinter string `ini:"ip printer" json:"ipPrinter"`
}

type ConfigDriver struct{}

func (c ConfigDriver) getFile() *ini.File {
	cfg, err := ini.Load(configPath)
	if err != nil {
		panic(err)
	}

	return cfg
}

func (c ConfigDriver) HasSection(name string) bool {
	cfg := c.getFile()
	return cfg.HasSection(name)
}

func (c ConfigDriver) GetData(name string, data any) {
	cfg := c.getFile()

	if cfg.HasSection(name) {
		sec := cfg.Section(name)
		sec.MapTo(data)
	}
}

func (c ConfigDriver) PutData(name string, data any) {
	cfg := c.getFile()

	sec := cfg.Section(name)

	if err := sec.ReflectFrom(data); err != nil {
		panic(err)
	}

	if err := cfg.SaveTo(configPath); err != nil {
		panic(err)
	}
}
