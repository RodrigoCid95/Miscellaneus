package server

import (
	"Miscellaneous/models"
	"Miscellaneous/server/api"
	"context"
	"encoding/gob"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

type Server struct {
	e         *echo.Echo
	cancel    context.CancelFunc
	isRunning bool
}

func NewServer(assets fs.FS) *Server {
	gob.Register(models.User{})
	e := echo.New()

	sessionPath := filepath.Join(".", "sessions")
	if err := os.MkdirAll(sessionPath, 0755); err != nil {
		panic(err)
	}
	cookieStore := sessions.NewFilesystemStore(sessionPath, []byte("secret"))
	e.Use(session.Middleware(cookieStore))

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Logger.SetLevel(log.INFO)

	www := echo.MustSubFS(assets, "frontend/dist")

	e.StaticFS("/", www)
	e.FileFS("/", "index-server.html", www)

	api.RegisterAuthAPI(e)
	api.RegisterProfileAPI(e)
	api.RegisterUsersAPI(e)
	api.RegisterProvidersAPI(e)
	api.RegisterBarcodesAPI(e)
	api.RegisterProductsAPI(e)
	api.RegisterHistoryAPI(e)
	api.RegisterConfigAPI(e)

	return &Server{e: e}
}

func (s *Server) Start() {
	port := ":" + models.Config.LoadConfig().Port
	if err := s.e.Start(port); err != nil {
		s.e.Logger.Fatal("error iniciando el servidor: ", err)
	}
}

func (s *Server) StartOfBackground() {
	ctx, cancel := context.WithCancel(context.Background())
	s.cancel = cancel
	port := ":" + models.Config.LoadConfig().Port

	go func() {
		if err := s.e.Start(port); err != nil && err != http.ErrServerClosed {
			s.e.Logger.Fatal("error iniciando el servidor: ", err)
			s.isRunning = false
		}
	}()

	s.e.Logger.Info("Servidor iniciado en http://localhost" + port)
	s.isRunning = true
	<-ctx.Done()
}

func (s *Server) Stop() {
	if s.cancel != nil {
		s.cancel()
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	s.e.Logger.Info("Deteniendo servidor...")

	if err := s.e.Shutdown(ctx); err != nil {
		s.e.Logger.Error("error al apagar el servidor: ", err)
		s.isRunning = true
	} else {
		s.e.Logger.Info("Servidor detenido correctamente ✅")
		s.isRunning = false
	}
}
