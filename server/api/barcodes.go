package api

import (
	"Miscellaneous/models"
	"Miscellaneous/server/middlewares"
	"Miscellaneous/utils"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type BarCodesAPI struct{}

func (bc *BarCodesAPI) CreateBarCode(c echo.Context) error {
	var data models.NewBarCode
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta el nombre del Código de barras."))
	}
	if data.Value == "" {
		return c.JSON(utils.APIBadRequest("missing-value", "Falta el valor del Código de barras."))
	}

	models.BarCodes.Create(data)

	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) GetBarCodes(c echo.Context) error {
	results := models.BarCodes.GetAll()
	return c.JSON(http.StatusOK, results)
}

func (bc *BarCodesAPI) UpdateBarCode(c echo.Context) error {
	var data models.BarCode
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.Name == "" {
		return c.JSON(utils.APIBadRequest("missing-name", "Falta el nombre del Código de barras."))
	}
	if data.Value == "" {
		return c.JSON(utils.APIBadRequest("missing-value", "Falta el valor del Código de barras."))
	}

	models.BarCodes.Update(data)

	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) DeleteBarCode(c echo.Context) error {
	strId := c.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		return c.NoContent(http.StatusAccepted)
	}

	models.BarCodes.Delete(id)
	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) GetBarCodeSrc(c echo.Context) error {
	strId := c.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		return c.NoContent(http.StatusAccepted)
	}

	barcode := models.BarCodes.Get(id)
	if bc == nil {
		return c.String(http.StatusOK, "")
	}

	result := utils.GenerateDataURLBarcode(barcode.Value, barcode.Tag)
	return c.String(http.StatusOK, result)
}

func RegisterBarcodesAPI(e *echo.Echo) {
	bc := BarCodesAPI{}

	e.POST("/api/bar-codes", bc.CreateBarCode, middlewares.SM.VerifySession)
	e.GET("/api/bar-codes", bc.GetBarCodes, middlewares.SM.VerifySession)
	e.PUT("/api/bar-codes", bc.UpdateBarCode, middlewares.SM.VerifySession)
	e.DELETE("/api/bar-codes/:id", bc.DeleteBarCode, middlewares.SM.VerifySession)
	e.GET("/api/bar-codes/:id", bc.GetBarCodeSrc, middlewares.SM.VerifySession)
}
