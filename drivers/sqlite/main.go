package main

import (
	"Miscellaneous/plugins/plugins"
	"Miscellaneous/sqlite/db"
	"Miscellaneous/sqlite/servers"
	"Miscellaneous/utils/fs"
	"Miscellaneous/utils/paths"
)

func main() {
	configPath := paths.ResolvePath("miscellaneous.conf")
	if !fs.FileExists(configPath) {
		fs.WriteFile(configPath, "")
	}

	plugins.NewServer(&plugins.ServerOptions{
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
