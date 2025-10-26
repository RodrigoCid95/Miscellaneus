package core

import (
	"Miscellaneous/core/config"
	"Miscellaneous/core/connectors"
	"Miscellaneous/core/models"
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
	} else {
		Users = connectors.UsersSQLiteConnector{}
		Profile = connectors.ProfileSQLiteConnector{}
		Providers = connectors.ProvidersSQLiteConnector{}
		BarCodes = connectors.BarCodesSQLiteConnector{}
		Products = connectors.ProductsSQLiteConnector{}
		Checkout = connectors.CheckoutSQLiteConnector{}
		History = connectors.HistorySQLiteConnector{}
	}
}
