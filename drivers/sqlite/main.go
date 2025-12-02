package main

import (
	"Miscellaneous/plugins/plugins"
	"Miscellaneous/sqlite/db"
	"Miscellaneous/sqlite/servers"
)

func main() {
	plugins.NewServer(&plugins.ServerOptions{
		Name:            "sqlite",
		BarCodesServer:  servers.BarCodesServer{},
		CheckoutServer:  servers.CheckoutServer{},
		HistoryServer:   servers.HistoryServer{},
		ProductsServer:  servers.ProductsServer{},
		ProfileServer:   servers.ProfileServer{},
		ProvidersServer: servers.ProvidersServer{},
		UsersServer:     servers.UsersServer{},
		OnKill: func() {
			db.Client.Close()
		},
	})
}
