package libs

import (
	"Miscellaneous/core/config"
	"context"
	"strconv"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var Database *mongo.Database

type mongoConfig struct {
	Host     string `ini:"host"`
	Port     int    `ini:"port"`
	UseSrv   bool   `ini:"use srv"`
	Database string `ini:"name database"`
	UserName string `ini:"user name"`
	Password string `ini:"password"`
	Options  string `ini:"options"`
}

func init() {
	hasMongoSection := config.Driver.HasSection("MongoDB")

	if hasMongoSection {
		data := mongoConfig{}
		config.Driver.GetData("MongoDB", &data)

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
}
