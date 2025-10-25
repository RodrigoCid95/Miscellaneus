package api

import (
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
	var products []models.ProductGroup
	if err := c.Bind(&products); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	report := [][]string{}
	total := 0
	UTC := time.Now().UnixMilli()
	for _, v := range products {
		subTotal := v.Price * v.Count
		models.Checkout.CreateSale(models.NewSale{
			Product: v.Id,
			Count:   v.Count,
			Total:   subTotal,
		}, profile.Id, UTC)
		models.Products.Update(models.DataProduct{
			Id:          v.Id,
			Name:        v.Name,
			Description: v.Description,
			Sku:         v.Sku,
			Price:       v.Price,
			Stock:       v.Stock - v.Count,
			MinStock:    v.MinStock,
			IdProvider:  v.Provider.Id,
		})
		reportItem := []string{strconv.Itoa(v.Count), v.Name, strconv.Itoa(subTotal)}
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

	results := models.Checkout.GetHistory(profile.Id)

	return c.JSON(http.StatusOK, results)
}

func (ch *Checkout) RestoreHistory(c echo.Context) error {
	strId := c.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		return c.NoContent(http.StatusAccepted)
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusOK)
	}

	saleResult := models.History.FindByID(id)
	if saleResult == nil {
		return c.NoContent(http.StatusOK)
	}

	if saleResult.IdUser != profile.Id && !profile.IsAdmin {
		return c.NoContent(http.StatusOK)
	}

	product := models.Products.Get(saleResult.IdProduct)
	if product == nil {
		return c.NoContent(http.StatusOK)
	}

	models.Products.Update(models.DataProduct{
		Id:          product.Id,
		Name:        product.Name,
		Description: product.Description,
		Sku:         product.Sku,
		Price:       product.Price,
		Stock:       product.Stock + saleResult.Count,
		MinStock:    product.MinStock,
		IdProvider:  product.Provider.Id,
	})

	models.Checkout.DeleteSale(id)

	return c.NoContent(http.StatusOK)
}

func RegisterCheckoutAPI(e *echo.Echo) {
	ch := Checkout{}

	e.GET("/api/sales", ch.GetHistory, middlewares.SM.VerifySession)
	e.DELETE("/api/sales/:id", ch.RestoreHistory, middlewares.SM.VerifySession)
	e.PUT("/api/sales", ch.SaveCheckout, middlewares.SM.VerifySession)
}
