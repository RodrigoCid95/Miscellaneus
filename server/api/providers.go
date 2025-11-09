package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ProvidersAPI struct{}

func (p *ProvidersAPI) SaveProvider(c echo.Context) error {
	var data structs.NewProvider
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	if err := modules.Providers.Create(data); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (p *ProvidersAPI) GetProviders(c echo.Context) error {
	results, err := modules.Providers.GetAll()
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (p *ProvidersAPI) UpdateProvider(c echo.Context) error {
	var data structs.Provider
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	if err := modules.Providers.Update(data); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (p *ProvidersAPI) DeleteProvider(c echo.Context) error {
	id := c.Param("id")
	if err := modules.Providers.Delete(id); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func RegisterProvidersAPI(e *echo.Echo) {
	p := ProvidersAPI{}

	e.POST("/api/providers", p.SaveProvider, middlewares.SM.VerifySession)
	e.GET("/api/providers", p.GetProviders, middlewares.SM.VerifySession)
	e.PUT("/api/providers", p.UpdateProvider, middlewares.SM.VerifySession)
	e.DELETE("/api/providers/:id", p.DeleteProvider, middlewares.SM.VerifySession)
}
