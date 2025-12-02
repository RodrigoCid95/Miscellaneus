package db

import (
	"Miscellaneous/utils/config"
	"context"
	"strconv"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoConfig struct {
	Host     string `ini:"host" flag:"host" env:"DB_HOST" usage:"Host de mongodb."`
	Port     int    `ini:"port" flag:"port" env:"DB_PORT" usage:"Puerto del host de mongodb."`
	UseSrv   bool   `ini:"use srv" flag:"use-srv" env:"USE_SRV" usage:"Indica si se va a usar srv en la cadena de conexión."`
	Database string `ini:"name database" flag:"name" env:"DB_NAME" usage:"Nombre de la base de datos"`
	UserName string `ini:"user name" flag:"user" env:"DB_USER" usage:"Nombre de usuario de la base de datos."`
	Password string `ini:"password" flag:"password" env:"DB_PASSWORD" usage:"Contraseña de la base de datos."`
	Options  string `ini:"options" flag:"options" env:"DB_OPTIONS" usage:"Opciones usadas en la cadena de conexión con mongodb."`
}

var Client *mongo.Client
var Database *mongo.Database

func init() {
	configNameSection := "MongoDB"

	data := mongoConfig{
		Host:     "localhost",
		Port:     27017,
		UseSrv:   false,
		Database: "miscellaneous",
		UserName: "",
		Password: "",
	}
	if !config.ConfigController.HasSection(configNameSection) {
		config.ConfigController.PutData(configNameSection, &data)
	}

	config.ConfigController.GetData(configNameSection, &data)
	config.LoadExternalConfig(&data)

	uri := "mongodb"
	if data.UseSrv {
		uri += "+srv"
	}
	uri += "://"
	if data.UserName != "" {
		uri += data.UserName
	}
	if data.UserName != "" || data.Password != "" {
		uri += ":"
	}
	if data.Password != "" {
		uri += data.Password
	}
	if data.UserName != "" || data.Password != "" {
		uri += "@"
	}
	uri += data.Host
	if data.Port > 0 {
		uri += ":" + strconv.Itoa(data.Port)
	}
	if data.Options != "" {
		uri += "?" + data.Options
	}

	opts := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	Client = client
	Database = client.Database(data.Database)
}
