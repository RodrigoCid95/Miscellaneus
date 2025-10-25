package api

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ConfigAPI struct{}

func (co *ConfigAPI) GetConfig(c echo.Context) error {
	config := models.Config.LoadConfig()

	return c.JSON(http.StatusOK, config)
}

func (co *ConfigAPI) SaveConfig(c echo.Context) error {
	var config models.ConfigData
	if err := c.Bind(&config); err != nil {
		return c.JSON(utils.APIBadRequest("missing-credentials", "Credenciales requeridas."))
	}

	if config.Name == "" || config.IpPrinter == "" {
		return c.JSON(utils.APIBadRequest("fields-required", "Faltan parámetros."))
	}

	models.Config.UpdateConfig(config)
	return c.JSON(http.StatusOK, true)
}

func RegisterConfigAPI(e *echo.Echo) {
	co := ConfigAPI{}

	e.GET("/api/config", co.GetConfig)
	e.PUT("/api/config", co.SaveConfig, middlewares.SM.VerifySession)
}
