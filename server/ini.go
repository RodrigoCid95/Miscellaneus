package server

import (
	"Miscellaneous/models"
	"Miscellaneous/server/api"
	"Miscellaneous/utils"
	"context"
	"encoding/gob"
	"io/fs"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

type Server struct {
	re        *echo.Echo
	e         *echo.Echo
	cancel    context.CancelFunc
	isRunning bool
}

func init() {
	certsDirPath := filepath.Join(".", "data", "certs")
	if !utils.DirExists(certsDirPath) {
		utils.Mkdir(certsDirPath)
		err := generateSelfSignedCert()
		if err != nil {
			panic(err)
		}
	}
}

func redirectToHTTPS() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			host := req.Host
			target := "https://" + host + req.RequestURI
			return c.Redirect(http.StatusMovedPermanently, target)
		}
	}
}

func NewServer(assets fs.FS) *Server {
	gob.Register(models.User{})
	re := echo.New()
	re.Pre(redirectToHTTPS())

	e := echo.New()

	sessionPath := filepath.Join(".", "data", "sessions")
	if !utils.DirExists(sessionPath) {
		utils.Mkdir(sessionPath)
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

	return &Server{e: e, re: re}
}

func (s *Server) Start() {
	go func() {
		if err := s.re.Start(":80"); err != nil && err != http.ErrServerClosed {
			s.re.Logger.Fatal("error iniciando el servidor: ", err)
			s.isRunning = false
		}
	}()

	certPath := filepath.Join(".", "data", "certs", "misc.crt")
	keyPath := filepath.Join(".", "data", "certs", "misc.key")
	if err := s.e.StartTLS(":443", certPath, keyPath); err != nil && err != http.ErrServerClosed {
		s.e.Logger.Fatal("error iniciando el servidor: ", err)
		s.isRunning = false
	}
}

func (s *Server) StartOfBackground() {
	ctx, cancel := context.WithCancel(context.Background())
	s.cancel = cancel

	go s.Start()

	s.e.Logger.Info("Servidor iniciado en http://localhost")
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

	if err := s.re.Shutdown(ctx); err != nil {
		s.re.Logger.Error("error al apagar el servidor: ", err)
		s.isRunning = true
	} else {
		s.re.Logger.Info("Servidor detenido correctamente ✅")
		s.isRunning = false
	}

	if err := s.e.Shutdown(ctx); err != nil {
		s.e.Logger.Error("error al apagar el servidor: ", err)
		s.isRunning = true
	} else {
		s.e.Logger.Info("Servidor detenido correctamente ✅")
		s.isRunning = false
	}
}
