package main

import (
	"Miscellaneous/mongo/db"
	"Miscellaneous/mongo/servers"
	"Miscellaneous/plugins/plugins"
	"context"
	"slices"

	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	collectionNames := []string{"users", "providers", "barcodes", "products", "sales"}
	names, _ := db.Database.ListCollectionNames(context.Background(), bson.M{})
	for _, name := range collectionNames {
		if !slices.Contains(names, name) {
			db.Database.CreateCollection(context.Background(), name)
		}
	}

	salesCollection := db.Database.Collection("sales")
	usersCollection := db.Database.Collection("users")

	plugins.NewServer(&plugins.ServerOptions{
		Name:            "mongodb",
		BarCodesServer:  servers.BarCodesServer{Collect: db.Database.Collection("barcodes")},
		CheckoutServer:  servers.CheckoutServer{Collect: salesCollection},
		HistoryServer:   servers.HistoryServer{Collect: salesCollection},
		ProductsServer:  servers.ProductsServer{Collect: db.Database.Collection("products")},
		ProfileServer:   servers.ProfileServer{Collect: usersCollection},
		ProvidersServer: servers.ProvidersServer{Collect: db.Database.Collection("providers")},
		UsersServer:     servers.UsersServer{Collect: usersCollection},
		OnKill: func() {
			db.Client.Disconnect(context.Background())
		},
	})
}
