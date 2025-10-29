package core

import (
	"Miscellaneous/core/config"
	"Miscellaneous/core/connectors"
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"
	"slices"

	"go.mongodb.org/mongo-driver/bson"
)

var Users models.UsersModel
var Profile models.ProfileModel
var Providers models.ProvidersModel
var BarCodes models.BarCodesModel
var Products models.ProductsModel
var Checkout models.CheckoutModel
var History models.HistoryModel

func init() {
	hasMongoSection := config.Driver.HasSection("MongoDB")
	if hasMongoSection {
		collectionNames := []string{"users", "providers", "barcodes", "products", "sales"}
		names, _ := libs.Database.ListCollectionNames(context.TODO(), bson.M{})
		for _, name := range collectionNames {
			if !slices.Contains(names, name) {
				libs.Database.CreateCollection(context.TODO(), name)
			}
		}

		usersCollection := libs.Database.Collection("users")
		salesCollection := libs.Database.Collection("sales")

		Users = connectors.UsersMongoDBConnector{Collect: usersCollection}
		Profile = connectors.ProfileMongoDBConnector{Collect: usersCollection}
		Providers = connectors.ProvidersMongoDBConnector{Collect: libs.Database.Collection("providers")}
		BarCodes = connectors.BarCodesMongoDBConnector{Collect: libs.Database.Collection("barcodes")}
		Products = connectors.ProductsMongoDBConnector{Collect: libs.Database.Collection("products")}
		Checkout = connectors.CheckoutMongoDBConnector{Collect: salesCollection}
		History = connectors.HistoryMongoDBConnector{Collect: salesCollection}
	} else {
		Users = connectors.UsersSQLiteConnector{}
		Profile = connectors.ProfileSQLiteConnector{}
		Providers = connectors.ProvidersSQLiteConnector{}
		BarCodes = connectors.BarCodesSQLiteConnector{}
		Products = connectors.ProductsSQLiteConnector{}
		Checkout = connectors.CheckoutSQLiteConnector{}
		History = connectors.HistorySQLiteConnector{}
	}

	users := Users.GetAll()
	if len(users) == 0 {
		Users.Create(models.NewUser{
			UserName: "admin",
			FullName: "Admin",
			IsAdmin:  true,
			Password: "password",
		})
	}
}

func CloseDB() {
	hasMongoSection := config.Driver.HasSection("MongoDB")
	if hasMongoSection {
		libs.Client.Disconnect(context.TODO())
	} else {
		libs.DB.Close()
	}
}
