package config

import "gopkg.in/ini.v1"

type ConfigDriver struct {
	Path string
}

func (c ConfigDriver) getFile() *ini.File {
	cfg, err := ini.Load(c.Path)
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

	if err := cfg.SaveTo(c.Path); err != nil {
		panic(err)
	}
}
