package main

import (
	"Miscellaneous/app"
	"Miscellaneous/controllers"
	"Miscellaneous/libs"
	"Miscellaneous/server"
	"Miscellaneous/utils"
	"embed"
	"os"
	"path/filepath"
	"slices"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var appAssets embed.FS

func main() {
	dataDir := filepath.Join(".", ".data")
	if !utils.DirExists(dataDir) {
		utils.Mkdir(dataDir)
	}

	profile := &controllers.Profile{}
	auth := &controllers.Auth{}
	config := &controllers.Config{}
	users := &controllers.Users{}
	providers := &controllers.Providers{}
	barcodes := &controllers.BarCodes{}
	products := &controllers.Products{}
	history := &controllers.History{}
	checkout := &controllers.Checkout{}
	server := server.NewServer(appAssets)

	argsWithoutProg := os.Args[1:]
	var onlyServer bool = false
	if slices.Contains(argsWithoutProg, "onlyServer") {
		onlyServer = true
	}

	if onlyServer {
		server.Start()
	} else {
		name := config.GetConfig().Name
		app.Window.SetServer(server)

		err := wails.Run(&options.App{
			Title:       "Miscellaneous - " + name,
			Width:       500,
			Height:      768,
			AssetServer: &assetserver.Options{Assets: appAssets},
			Windows:     &windows.Options{Theme: windows.SystemDefault},
			OnStartup:   app.Window.OnStartup,
			Bind:        []any{profile, auth, config, users, providers, barcodes, products, history, checkout},
		})

		if err != nil {
			println("Error:", err.Error())
		}

		server.Stop()
		libs.DB.Close()
	}
}
