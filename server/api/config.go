package api

import (
	"Miscellaneous/core/config"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ConfigAPI struct{}

func (co *ConfigAPI) GetConfig(c echo.Context) error {
	data := config.ConfigData{}
	config.Driver.GetData(config.SystemConfigName, &data)

	return c.JSON(http.StatusOK, data)
}

func (co *ConfigAPI) SaveConfig(c echo.Context) error {
	var data config.ConfigData
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-credentials", "Credenciales requeridas."))
	}

	if data.Name == "" || data.IpPrinter == "" {
		return c.JSON(utils.APIBadRequest("fields-required", "Faltan parámetros."))
	}

	config.Driver.PutData(config.SystemConfigName, &data)
	return c.JSON(http.StatusOK, true)
}

func RegisterConfigAPI(e *echo.Echo) {
	co := ConfigAPI{}

	e.GET("/api/config", co.GetConfig)
	e.PUT("/api/config", co.SaveConfig, middlewares.SM.VerifySession)
}
