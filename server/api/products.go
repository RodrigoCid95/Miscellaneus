package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ProductsAPI struct{}

func (p *ProductsAPI) CreateProduct(c echo.Context) error {
	var data structs.NewProduct
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	err := modules.Products.Create(data)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (p *ProductsAPI) GetProducts(c echo.Context) error {
	results, err := modules.Products.GetAll()
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (p *ProductsAPI) GetFilterProducts(c echo.Context) error {
	query := c.Param("query")
	results, err := modules.Products.Find(query)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (p *ProductsAPI) UpdateProduct(c echo.Context) error {
	var data structs.DataProduct
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	if err := modules.Products.Update(data); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (p *ProductsAPI) DeleteProduct(c echo.Context) error {
	id := c.Param("id")
	if err := modules.Products.Delete(id); err != nil {
		return errors.ProcessError(err, c)
	}

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
