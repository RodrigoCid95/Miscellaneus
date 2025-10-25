package main

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/api"
	"Miscellaneous/server/certificate"
	"context"
	"embed"
	"encoding/gob"
	"net/http"
	"path/filepath"

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

//go:embed all:www
var assets embed.FS

var mainDirs []string = []string{
	filepath.Join(".", ".data", "server"),
	filepath.Join(".", ".data", "server", "certs"),
	filepath.Join(".", ".data", "server", "sessions"),
}

func main() {
	for _, d := range mainDirs {
		if !utils.DirExists(d) {
			utils.Mkdir(d)
		}
	}

	key := utils.ReadFile(certificate.KeyPath)
	cookieStore := sessions.NewFilesystemStore(mainDirs[2], key)

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

	www := echo.MustSubFS(assets, "www")

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

	go func() {
		httpServer.Logger.Fatal(httpServer.Start(":80"))
	}()

	httpsServer.Logger.Fatal(httpsServer.StartTLS(":443", certificate.CertPath, certificate.KeyPath))
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
