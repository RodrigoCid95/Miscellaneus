package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ConfigAPI struct{}

func (co *ConfigAPI) GetConfig(c echo.Context) error {
	data, err := modules.Config.GetConfig()
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, *data)
}

func (co *ConfigAPI) SaveConfig(c echo.Context) error {
	var data structs.ConfigData
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	err := modules.Config.SaveConfig(data)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, true)
}

func RegisterConfigAPI(e *echo.Echo) {
	co := ConfigAPI{}

	e.GET("/api/config", co.GetConfig)
	e.PUT("/api/config", co.SaveConfig, middlewares.SM.VerifySession)
}
