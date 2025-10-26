package app

import (
	"context"
	"runtime"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type WindowApp struct {
	ctx    *context.Context
	server *Server
}

func (a *WindowApp) OnStartup(ctx context.Context) {
	a.ctx = &ctx
	a.server = &Server{}
	rt.WindowCenter(ctx)
	rt.MenuSetApplicationMenu(ctx, a.GetMenu())
}

func (a *WindowApp) OnShutdown(ctx context.Context) {
	if a.server.IsEnabled() {
		a.server.Stop()
	}
}

func (a *WindowApp) SetTitle(title string) {
	rt.WindowSetTitle(*a.ctx, title)
}

func (a *WindowApp) GetMenu() *menu.Menu {
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

	if a.server.IsEnabled() {
		ServerMenu := AppMenu.AddSubmenu("Servidor")
		if a.server.IsRunning() {
			ServerMenu.AddText("Detener", nil, func(cd *menu.CallbackData) {
				a.server.Stop()
				rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu())
			})
		} else {
			ServerMenu.AddText("Iniciar", nil, func(cd *menu.CallbackData) {
				a.server.Start()
				rt.MenuSetApplicationMenu(*a.ctx, a.GetMenu())
			})
		}
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
