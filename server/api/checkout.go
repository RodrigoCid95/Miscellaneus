package api

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

type Checkout struct{}

func (ch *Checkout) SaveCheckout(c echo.Context) error {
	var products []models.CheckoutItem
	if err := c.Bind(&products); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	report := [][]string{}
	total := 0.0
	UTC := time.Now().UnixMilli()
	for _, v := range products {
		product := core.Products.Get(v.Id)
		if product == nil {
			continue
		}
		subTotal := product.Price * float64(v.Count)
		core.Checkout.CreateSale(models.NewSale{
			Product: v.Id,
			Count:   v.Count,
			Total:   subTotal,
		}, profile.Id, UTC)
		newStock := 0 - v.Count
		core.Products.UpdateStock(v.Id, newStock)
		reportItem := []string{strconv.Itoa(v.Count), product.Name, strconv.FormatFloat(subTotal, 'f', 2, 64)}
		report = append(report, reportItem)
		total += subTotal
	}
	fmt.Println(report)

	return c.NoContent(http.StatusOK)
}

func (ch *Checkout) GetHistory(c echo.Context) error {
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.JSON(http.StatusOK, []any{})
	}

	results := core.Checkout.GetHistory(profile.Id)

	return c.JSON(http.StatusOK, results)
}

func (ch *Checkout) RestoreHistory(c echo.Context) error {
	id := c.Param("id")

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	saleResult := core.History.FindByID(id)
	if saleResult == nil {
		return c.NoContent(http.StatusOK)
	}

	if saleResult.IdUser != profile.Id && !profile.IsAdmin {
		return c.NoContent(http.StatusOK)
	}

	product := core.Products.Get(saleResult.IdProduct)
	if product == nil {
		return c.NoContent(http.StatusOK)
	}

	core.Products.UpdateStock(product.Id, saleResult.Count)

	core.Checkout.DeleteSale(id)

	return c.NoContent(http.StatusOK)
}

func RegisterCheckoutAPI(e *echo.Echo) {
	ch := Checkout{}

	e.GET("/api/sales", ch.GetHistory, middlewares.SM.VerifySession)
	e.PUT("/api/sales", ch.SaveCheckout, middlewares.SM.VerifySession)
	e.DELETE("/api/sales/:id", ch.RestoreHistory, middlewares.SM.VerifySession)
}
