package main

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/api"
	"Miscellaneous/server/certificate"
	"embed"
	"encoding/gob"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

//go:embed all:www
var assets embed.FS

var mainDirs []string = []string{
	filepath.Join(".", ".data"),
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

	gob.Register(models.User{})

	port := os.Getenv("PORT")

	if port == "" {
		httpServer := echo.New()
		httpServer.Pre(redirectToHTTPS())
		httpServer.Use(middleware.Logger())
		httpServer.Use(middleware.Recover())
		httpServer.Logger.SetLevel(log.INFO)

		httpsServer := echo.New()
		setRoutes(httpsServer)

		go func() {
			httpServer.Logger.Fatal(httpServer.Start(":80"))
		}()

		if !utils.FileExists(certificate.CertPath) || !utils.FileExists(certificate.KeyPath) {
			certificate.Generate()
		}

		httpsServer.Logger.Fatal(httpsServer.StartTLS(":443", certificate.CertPath, certificate.KeyPath))
	} else {
		httpServer := echo.New()
		setRoutes(httpServer)

		httpServer.Logger.Fatal(httpServer.Start(":" + port))
	}
}

func setRoutes(e *echo.Echo) {
	key := utils.ReadFile(certificate.KeyPath)
	cookieStore := sessions.NewFilesystemStore(mainDirs[2], key)
	e.Use(session.Middleware(cookieStore))

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Logger.SetLevel(log.INFO)

	www := echo.MustSubFS(assets, "www")

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
	api.RegisterCheckoutAPI(e)
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
