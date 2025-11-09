package main

import (
	"Miscellaneous/app"
	"Miscellaneous/controllers"
	"Miscellaneous/core/driver"
	"Miscellaneous/core/modules"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:www
var appAssets embed.FS

func main() {
	driver.Start()
	modules.Wire(driver.Connection)
	defer driver.Kill()

	profile := &controllers.Profile{}
	auth := &controllers.Auth{}
	config := &controllers.Config{}
	users := &controllers.Users{}
	providers := &controllers.Providers{}
	barcodes := &controllers.BarCodes{}
	products := &controllers.Products{}
	history := &controllers.History{}
	checkout := &controllers.Checkout{}

	data, err := modules.Config.GetConfig()
	if err != nil {
		panic(err)
	}
	name := data.Name

	runErr := wails.Run(&options.App{
		Title:       "Miscellaneous - " + name,
		Width:       500,
		Height:      768,
		AssetServer: &assetserver.Options{Assets: appAssets},
		Windows:     &windows.Options{Theme: windows.SystemDefault},
		OnStartup:   app.Window.OnStartup,
		OnShutdown:  app.Window.OnShutdown,
		Bind:        []any{profile, auth, config, users, providers, barcodes, products, history, checkout},
	})

	if runErr != nil {
		println("Error:", runErr.Error())
	}
}
