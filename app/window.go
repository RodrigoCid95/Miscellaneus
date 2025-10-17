package app

import (
	"Miscellaneous/models"
	"Miscellaneous/server"
	"context"
	"runtime"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type WindowApp struct {
	server *server.Server
	ctx    *context.Context
}

func (a *WindowApp) SetServer(s *server.Server) {
	a.server = s
}

func (a *WindowApp) OnStartup(ctx context.Context) {
	rt.WindowCenter(ctx)
	a.ctx = &ctx
	rt.MenuSetApplicationMenu(ctx, a.GetMenu(false))
}

func (a *WindowApp) SetTitle(title string) {
	rt.WindowSetTitle(*a.ctx, title)
}

func (a *WindowApp) GetMenu(serverRunning bool) *menu.Menu {
	AppMenu := menu.NewMenu()
	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu())
	}
	FileMenu := AppMenu.AddSubmenu("Archivo")
	serverLabel := "Iniciar servidor!"
	if serverRunning {
		port := models.Config.LoadConfig().Port
		serverLabel = "Servidor corriendo en http://localhost:" + port
	}
	FileMenu.AddCheckbox(serverLabel, serverRunning, nil, func(cd *menu.CallbackData) {
		if cd.MenuItem.Checked {
			go a.server.StartOfBackground()
			rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu(cd.MenuItem.Checked))
		} else {
			a.server.Stop()
			rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu(cd.MenuItem.Checked))
		}
	})
	FileMenu.AddSeparator()
	FileMenu.AddText("Salir", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		rt.Quit(*a.ctx)
	})

	if runtime.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu())
	}

	return AppMenu
}

func (a *WindowApp) SetTheme(isDark bool) {
	if isDark {
		rt.WindowSetBackgroundColour(*a.ctx, 41, 41, 41, 1)
	} else {
		rt.WindowSetBackgroundColour(*a.ctx, 255, 255, 255, 1)
	}
}
