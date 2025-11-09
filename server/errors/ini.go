package errors

import (
	"Miscellaneous/models/structs"
	"Miscellaneous/utils/errors"

	"github.com/labstack/echo/v4"
)

func ProcessError(err *structs.CoreError, c echo.Context) error {
	if err.IsInternal {
		return c.JSON(errors.APIInternalError())
	}
	return c.JSON(errors.APIBadRequest(err.Code, err.Message))
}
