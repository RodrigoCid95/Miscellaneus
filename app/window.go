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
	FileMenu.AddText("Salir", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		rt.Quit(*a.ctx)
	})

	ViewMenu := AppMenu.AddSubmenu("Ver")
	ViewMenu.AddText("Pantalla completa", keys.CmdOrCtrl("f"), func(_ *menu.CallbackData) {
		isFS := rt.WindowIsFullscreen(*a.ctx)
		if isFS {
			rt.WindowUnfullscreen(*a.ctx)
		} else {
			rt.WindowFullscreen(*a.ctx)
		}
	})

	ServerMenu := AppMenu.AddSubmenu("Servidor")
	if serverRunning {
		ServerMenu.AddText("Detener", nil, func(cd *menu.CallbackData) {
			a.server.Stop()
			rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu(false))
		})
		ServerMenu.AddSeparator()
		ServerMenu.AddText("Abrir", nil, func(cd *menu.CallbackData) {
			port := models.Config.LoadConfig().Port
			url := "http://localhost:" + port
			rt.BrowserOpenURL(*a.ctx, url)
		})
	} else {
		ServerMenu.AddText("Iniciar", nil, func(cd *menu.CallbackData) {
			go a.server.StartOfBackground()
			rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu(true))
		})
	}

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
