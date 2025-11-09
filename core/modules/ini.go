package modules

import (
	"Miscellaneous/plugins/grpcs"

	"google.golang.org/grpc"
)

var Auth *AuthModule
var BarCodes *BarcodesModule
var Checkout *CheckoutModule
var Config *ConfigModule
var History *HistoryModule
var Products *ProductsModule
var Profile *ProfileModule
var Providers *ProvidersModule
var Users *UsersModule

var barcodesModel grpcs.BarCodesClient
var checkoutModel grpcs.CheckoutClient
var historyModel grpcs.HistoryClient
var productsModel grpcs.ProductsClient
var profileModel grpcs.ProfileClient
var providersClient grpcs.ProvidersClient
var usersModel grpcs.UsersClient

func init() {
	Auth = &AuthModule{}
	BarCodes = &BarcodesModule{}
	Checkout = &CheckoutModule{}
	Config = &ConfigModule{}
	History = &HistoryModule{}
	Products = &ProductsModule{}
	Profile = &ProfileModule{}
	Providers = &ProvidersModule{}
	Users = &UsersModule{}
}

// Wire connects all modules to the shared gRPC connection.
func Wire(conn *grpc.ClientConn) {
	barcodesModel = grpcs.NewBarCodesClient(conn)
	checkoutModel = grpcs.NewCheckoutClient(conn)
	historyModel = grpcs.NewHistoryClient(conn)
	productsModel = grpcs.NewProductsClient(conn)
	profileModel = grpcs.NewProfileClient(conn)
	providersClient = grpcs.NewProvidersClient(conn)
	usersModel = grpcs.NewUsersClient(conn)
}
