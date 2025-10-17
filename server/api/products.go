package api

import (
	"Miscellaneous/models"
	"Miscellaneous/server/middlewares"
	"Miscellaneous/utils"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type ProductsAPI struct{}

func (p *ProductsAPI) CreateProduct(c echo.Context) error {
	var data models.NewProduct
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta un nombre."))
	}

	if data.Description == "" {
		return c.JSON(utils.APIBadRequest("missing-description", "Falta una descripción."))
	}

	if data.Sku == "" {
		return c.JSON(utils.APIBadRequest("missing-sku", "Falta un SKU."))
	}

	if data.Price == 0 {
		return c.JSON(utils.APIBadRequest("missing-price", "Falta un precio."))
	}

	if data.Stock == 0 {
		return c.JSON(utils.APIBadRequest("missing-stock", "Falta un stock inicial."))
	}

	if data.MinStock == 0 {
		return c.JSON(utils.APIBadRequest("missing-min-stock", "Falta un stock mínimo."))
	}

	if data.IdProvider == 0 {
		return c.JSON(utils.APIBadRequest("missing-provider", "Falta un proveedor."))
	}

	models.Products.Create(data)

	return c.NoContent(http.StatusAccepted)
}

func (p *ProductsAPI) GetProducts(c echo.Context) error {
	results := models.Products.GetAll()

	return c.JSON(http.StatusOK, results)
}

func (p *ProductsAPI) GetFilterProducts(c echo.Context) error {
	query := c.Param("query")
	results := models.Products.Find(query)

	return c.JSON(http.StatusOK, results)
}

func (p *ProductsAPI) UpdateProduct(c echo.Context) error {
	var data models.DataProduct
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta un nombre."))
	}

	if data.Description == "" {
		return c.JSON(utils.APIBadRequest("missing-description", "Falta una descripción."))
	}

	if data.Sku == "" {
		return c.JSON(utils.APIBadRequest("missing-sku", "Falta un SKU."))
	}

	if data.Price == 0 {
		return c.JSON(utils.APIBadRequest("missing-price", "Falta un precio."))
	}

	if data.Stock == 0 {
		return c.JSON(utils.APIBadRequest("missing-stock", "Falta un stock inicial."))
	}

	if data.MinStock == 0 {
		return c.JSON(utils.APIBadRequest("missing-min-stock", "Falta un stock mínimo."))
	}

	if data.IdProvider == 0 {
		return c.JSON(utils.APIBadRequest("missing-provider", "Falta un proveedor."))
	}

	models.Products.Update(data)

	return c.NoContent(http.StatusAccepted)
}

func (p *ProductsAPI) DeleteProduct(c echo.Context) error {
	strId := c.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		return c.NoContent(http.StatusAccepted)
	}

	models.Products.Delete(id)

	return c.NoContent(http.StatusAccepted)
}

func RegisterProductsAPI(e *echo.Echo) {
	p := ProductsAPI{}

	e.POST("/api/products", p.CreateProduct, middlewares.SM.VerifySession)
	e.GET("/api/products", p.GetProducts, middlewares.SM.VerifySession)
	e.GET("/api/products/:query", p.GetFilterProducts, middlewares.SM.VerifySession)
	e.PUT("/api/products", p.UpdateProduct, middlewares.SM.VerifySession)
	e.DELETE("/api/products/:id", p.DeleteProduct, middlewares.SM.VerifySession)
}
