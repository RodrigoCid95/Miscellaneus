package main

import (
	"Miscellaneous/controllers"
	"Miscellaneous/libs"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	controllers.Window = controllers.App{}
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
		Title:  "Miscellaneous - " + name,
		Width:  500,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 31, G: 31, B: 31, A: 1},
		OnStartup:        controllers.Window.OnStartup,
		Bind:             []any{profile, auth, config, users, providers, barcodes, products, history, checkout},
	})

	if err != nil {
		println("Error:", err.Error())
	}
	libs.DB.Close()
}
