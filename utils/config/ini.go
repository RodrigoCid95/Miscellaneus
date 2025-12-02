package config

import (
	"Miscellaneous/utils/assets"
	"Miscellaneous/utils/flags"
	"Miscellaneous/utils/fs"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"gopkg.in/ini.v1"
)

const (
	tagFlag = "flag"
	tagEnv  = "env"
	usage   = "usage"
)

type configController struct {
	Path string
}

func (c configController) getFile() *ini.File {
	cfg, err := ini.Load(c.Path)
	if err != nil {
		panic(err)
	}

	return cfg
}

func (c configController) HasSection(name string) bool {
	cfg := c.getFile()
	return cfg.HasSection(name)
}

func (c configController) GetData(name string, data any) {
	cfg := c.getFile()

	if cfg.HasSection(name) {
		sec := cfg.Section(name)
		sec.MapTo(data)
	}
}

func (c configController) PutData(name string, data any) {
	cfg := c.getFile()

	sec := cfg.Section(name)

	if err := sec.ReflectFrom(data); err != nil {
		panic(err)
	}

	if err := cfg.SaveTo(c.Path); err != nil {
		panic(err)
	}
}

var ConfigController *configController

type configSource struct {
	Path string `flag:"config" env:"CONFIG_PATH" usage:"Ruta de archivo de configuración"`
}

func init() {
	confSrc := configSource{}
	LoadExternalConfig(&confSrc)

	if confSrc.Path == "" {
		confSrc.Path = assets.ResolvePath("conf.ini")
	} else {
		confSrc.Path = fs.ResolvePath(confSrc.Path)
	}

	dirConfig := filepath.Dir(confSrc.Path)
	if !fs.DirExists(dirConfig) {
		fs.Mkdir(dirConfig)
	}

	if !fs.FileExists(confSrc.Path) {
		base := filepath.Dir(confSrc.Path)
		if !fs.DirExists(base) {
			fs.Mkdir(base)
		}
		fs.WriteFile(confSrc.Path, "")
	}

	fmt.Printf("Archivo de configuración cargado: %s\n", confSrc.Path)
	ConfigController = &configController{Path: confSrc.Path}
}

func LoadExternalConfig(cfgPtr any) error {
	ptrValue := reflect.ValueOf(cfgPtr)
	if ptrValue.Kind() != reflect.Ptr || ptrValue.IsNil() {
		return fmt.Errorf("se espera un puntero no nulo a un struct, recibido %v", ptrValue.Kind())
	}

	cfgValue := ptrValue.Elem()
	cfgType := cfgValue.Type()

	if cfgValue.Kind() != reflect.Struct {
		return fmt.Errorf("el puntero debe apuntar a un struct, apunta a %v", cfgValue.Kind())
	}

	flg := flag.NewFlagSet("", flag.ContinueOnError)
	flagMap := make(map[string]reflect.Value)

	for i := 0; i < cfgValue.NumField(); i++ {
		field := cfgType.Field(i)
		fieldValue := cfgValue.Field(i)

		if !fieldValue.CanSet() {
			continue
		}

		flagName := field.Tag.Get(tagFlag)
		if flagName == "" {
			continue
		}

		defaultValue := field.Tag.Get("default")
		if defaultValue == "" {
			defaultValue = fmt.Sprintf("%v", fieldValue.Interface())
		}

		var flagP any
		switch fieldValue.Kind() {
		case reflect.String:
			flagP = flg.String(flagName, defaultValue, field.Tag.Get(usage))
		case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
			var d int
			fmt.Sscanf(defaultValue, "%d", &d)
			flagP = flg.Int(flagName, d, field.Tag.Get(usage))
		case reflect.Bool:
			var d bool
			fmt.Sscanf(defaultValue, "%t", &d)
			flagP = flg.Bool(flagName, d, field.Tag.Get(usage))
		default:
			continue
		}

		flagMap[field.Name] = reflect.ValueOf(flagP)
	}

	args := flags.FilterArgsFor(flg, os.Args[1:])
	flg.Parse(args)

	for i := 0; i < cfgValue.NumField(); i++ {
		field := cfgType.Field(i)
		fieldValue := cfgValue.Field(i)

		if !fieldValue.CanSet() {
			continue
		}

		envName := field.Tag.Get(tagEnv)
		if envName != "" {
			if envValue := os.Getenv(envName); envValue != "" {
				if err := setFieldValue(fieldValue, envValue); err == nil {
					continue
				}
			}
		}

		if flagPValue, ok := flagMap[field.Name]; ok {
			flagValue := flagPValue.Elem().Interface()

			if err := setFieldValue(fieldValue, fmt.Sprintf("%v", flagValue)); err == nil {
				continue
			}
		}
	}

	return nil
}

func setFieldValue(fieldValue reflect.Value, value string) error {
	switch fieldValue.Kind() {
	case reflect.String:
		fieldValue.SetString(value)
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		var i int64
		_, err := fmt.Sscanf(value, "%d", &i)
		if err != nil {
			return fmt.Errorf("error al convertir %s a entero: %v", value, err)
		}
		fieldValue.SetInt(i)
	case reflect.Bool:
		var b bool
		if strings.ToLower(value) == "true" || value == "1" {
			b = true
		} else if strings.ToLower(value) == "false" || value == "0" {
			b = false
		} else {
			return fmt.Errorf("error al convertir %s a booleano", value)
		}
		fieldValue.SetBool(b)
	default:
		return fmt.Errorf("tipo de campo no soportado para asignación: %v", fieldValue.Kind())
	}
	return nil
}
