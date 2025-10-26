package main

import (
	"Miscellaneous/app"
	"Miscellaneous/controllers"
	"Miscellaneous/core/libs"
	"Miscellaneous/core/utils"
	"embed"
	"path/filepath"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:www
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

	name := config.GetConfig().Name

	err := wails.Run(&options.App{
		Title:       "Miscellaneous - " + name,
		Width:       500,
		Height:      768,
		AssetServer: &assetserver.Options{Assets: appAssets},
		Windows:     &windows.Options{Theme: windows.SystemDefault},
		OnStartup:   app.Window.OnStartup,
		OnShutdown:  app.Window.OnShutdown,
		Bind:        []any{profile, auth, config, users, providers, barcodes, products, history, checkout},
	})

	if err != nil {
		println("Error:", err.Error())
	}

	libs.DB.Close()
}
