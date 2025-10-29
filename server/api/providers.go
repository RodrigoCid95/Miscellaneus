package api

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ProvidersAPI struct{}

func (p *ProvidersAPI) SaveProvider(c echo.Context) error {
	var data models.NewProvider
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta el nombre del proveedor."))
	}
	if data.Phone == "" {
		return c.JSON(utils.APIBadRequest("missing-phone", "Falta el número de teléfono."))
	}

	core.Providers.Create(data)

	return c.NoContent(http.StatusAccepted)
}

func (p *ProvidersAPI) GetProviders(c echo.Context) error {
	results := core.Providers.GetAll()
	return c.JSON(http.StatusOK, results)
}

func (p *ProvidersAPI) UpdateProvider(c echo.Context) error {
	var data models.Provider
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta el nombre del proveedor."))
	}
	if data.Phone == "" {
		return c.JSON(utils.APIBadRequest("missing-phone", "Falta el número de teléfono."))
	}

	core.Providers.Update(data)

	return c.NoContent(http.StatusAccepted)
}

func (p *ProvidersAPI) DeleteProvider(c echo.Context) error {
	id := c.Param("id")
	core.Providers.Delete(id)
	return c.NoContent(http.StatusAccepted)
}

func RegisterProvidersAPI(e *echo.Echo) {
	p := ProvidersAPI{}

	e.POST("/api/providers", p.SaveProvider, middlewares.SM.VerifySession)
	e.GET("/api/providers", p.GetProviders, middlewares.SM.VerifySession)
	e.PUT("/api/providers", p.UpdateProvider, middlewares.SM.VerifySession)
	e.DELETE("/api/providers/:id", p.DeleteProvider, middlewares.SM.VerifySession)
}
