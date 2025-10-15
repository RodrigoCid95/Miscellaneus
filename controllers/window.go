package controllers

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx *context.Context
}

func (a *App) OnStartup(ctx context.Context) {
	runtime.WindowCenter(ctx)
	a.ctx = &ctx
}

func (a *App) SetTitle(title string) {
	runtime.WindowSetTitle(*a.ctx, title)
}
