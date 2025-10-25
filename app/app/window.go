package app

import (
	"context"
	"runtime"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type WindowApp struct {
	ctx *context.Context
}

func (a *WindowApp) OnStartup(ctx context.Context) {
	a.ctx = &ctx
	rt.WindowCenter(ctx)
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
