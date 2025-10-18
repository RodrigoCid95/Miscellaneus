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
	httpServer  *echo.Echo
	httpsServer *echo.Echo
	cancel      context.CancelFunc
	isRunning   bool
}

func init() {
	certsDirPath := filepath.Join(".", ".data", "certs")
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
	sessionPath := filepath.Join(".", ".data", "sessions")
	if !utils.DirExists(sessionPath) {
		utils.Mkdir(sessionPath)
	}
	key := utils.ReadFile(filepath.Join(".", ".data", "certs", "misc.key"))
	cookieStore := sessions.NewFilesystemStore(sessionPath, key)

	gob.Register(models.User{})

	httpServer := echo.New()
	httpServer.Pre(redirectToHTTPS())
	httpServer.Use(middleware.Logger())
	httpServer.Use(middleware.Recover())
	httpServer.Logger.SetLevel(log.INFO)

	httpsServer := echo.New()
	httpsServer.Use(session.Middleware(cookieStore))
	httpsServer.Use(middleware.Logger())
	httpsServer.Use(middleware.Recover())
	httpsServer.Logger.SetLevel(log.INFO)

	www := echo.MustSubFS(assets, "frontend/dist")

	httpsServer.StaticFS("/", www)
	httpsServer.FileFS("/", "index-server.html", www)

	api.RegisterAuthAPI(httpsServer)
	api.RegisterProfileAPI(httpsServer)
	api.RegisterUsersAPI(httpsServer)
	api.RegisterProvidersAPI(httpsServer)
	api.RegisterBarcodesAPI(httpsServer)
	api.RegisterProductsAPI(httpsServer)
	api.RegisterHistoryAPI(httpsServer)
	api.RegisterConfigAPI(httpsServer)
	api.RegisterCheckoutAPI(httpsServer)

	return &Server{httpsServer: httpsServer, httpServer: httpServer}
}

func (s *Server) Start() {
	go func() {
		if err := s.httpServer.Start(":80"); err != nil && err != http.ErrServerClosed {
			s.httpServer.Logger.Fatal("error iniciando el servidor: ", err)
			s.isRunning = false
		}
	}()

	certPath := filepath.Join(".", ".data", "certs", "misc.crt")
	keyPath := filepath.Join(".", ".data", "certs", "misc.key")
	if err := s.httpsServer.StartTLS(":443", certPath, keyPath); err != nil && err != http.ErrServerClosed {
		s.httpsServer.Logger.Fatal("error iniciando el servidor: ", err)
		s.isRunning = false
	}
}

func (s *Server) StartOfBackground() {
	ctx, cancel := context.WithCancel(context.Background())
	s.cancel = cancel

	go s.Start()

	s.httpsServer.Logger.Info("Servidor iniciado")
	s.isRunning = true
	<-ctx.Done()
}

func (s *Server) Stop() {
	if s.cancel != nil {
		s.cancel()
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	s.httpsServer.Logger.Info("Deteniendo servidor...")

	if err := s.httpServer.Shutdown(ctx); err != nil {
		s.httpServer.Logger.Error("error al apagar el servidor: ", err)
		s.isRunning = true
	} else {
		s.httpServer.Logger.Info("Servidor detenido correctamente ✅")
		s.isRunning = false
	}

	if err := s.httpsServer.Shutdown(ctx); err != nil {
		s.httpsServer.Logger.Error("error al apagar el servidor: ", err)
		s.isRunning = true
	} else {
		s.httpsServer.Logger.Info("Servidor seguro detenido correctamente ✅")
		s.isRunning = false
	}
}
