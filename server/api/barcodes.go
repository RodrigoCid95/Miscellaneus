package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type BarCodesAPI struct{}

func (bc *BarCodesAPI) CreateBarCode(c echo.Context) error {
	var data structs.NewBarCode
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-credentials",
			Message:    "Credenciales requeridas.",
		}, c)
	}

	err := modules.BarCodes.Create(data)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) GetBarCodes(c echo.Context) error {
	results, err := modules.BarCodes.GetAll()
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (bc *BarCodesAPI) UpdateBarCode(c echo.Context) error {
	var data structs.BarCode
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	err := modules.BarCodes.Update(data)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) DeleteBarCode(c echo.Context) error {
	id := c.Param("id")
	err := modules.BarCodes.Delete(id)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (bc *BarCodesAPI) GetBarCodeSrc(c echo.Context) error {
	id := c.Param("id")
	src, err := modules.BarCodes.GetSrc(id)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.String(http.StatusOK, src)
}

func RegisterBarcodesAPI(e *echo.Echo) {
	bc := BarCodesAPI{}

	e.POST("/api/bar-codes", bc.CreateBarCode, middlewares.SM.VerifySession)
	e.GET("/api/bar-codes", bc.GetBarCodes, middlewares.SM.VerifySession)
	e.PUT("/api/bar-codes", bc.UpdateBarCode, middlewares.SM.VerifySession)
	e.DELETE("/api/bar-codes/:id", bc.DeleteBarCode, middlewares.SM.VerifySession)
	e.GET("/api/bar-codes/:id", bc.GetBarCodeSrc, middlewares.SM.VerifySession)
}
