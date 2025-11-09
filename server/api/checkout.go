package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Checkout struct{}

func (ch *Checkout) SaveCheckout(c echo.Context) error {
	var products []structs.CheckoutItem
	if err := c.Bind(&products); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	err := modules.Checkout.CreateSale(profile, products)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusOK)
}

func (ch *Checkout) GetHistory(c echo.Context) error {
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.JSON(http.StatusOK, []structs.Sale{})
	}

	results, err := modules.Checkout.GetHistory(profile)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (ch *Checkout) RestoreHistory(c echo.Context) error {
	id := c.Param("id")

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	err := modules.Checkout.DeleteSale(profile, id)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusOK)
}

func RegisterCheckoutAPI(e *echo.Echo) {
	ch := Checkout{}

	e.GET("/api/sales", ch.GetHistory, middlewares.SM.VerifySession)
	e.PUT("/api/sales", ch.SaveCheckout, middlewares.SM.VerifySession)
	e.DELETE("/api/sales/:id", ch.RestoreHistory, middlewares.SM.VerifySession)
}
