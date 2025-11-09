package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type UsersAPI struct{}

func (u *UsersAPI) CreateUser(c echo.Context) error {
	var data structs.NewUser
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	if err := modules.Users.Create(data); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (u *UsersAPI) GetUsers(c echo.Context) error {
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.JSON(http.StatusOK, []any{})
	}

	results, err := modules.Users.GetAll(profile)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.JSON(http.StatusOK, results)
}

func (u *UsersAPI) UpdateUser(c echo.Context) error {
	var data structs.User
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	if err := modules.Users.Update(data); err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func (u *UsersAPI) DeleteUser(c echo.Context) error {
	id := c.Param("id")
	err := modules.Users.Delete(id)
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func RegisterUsersAPI(e *echo.Echo) {
	u := UsersAPI{}

	e.POST("/api/users", u.CreateUser, middlewares.SM.VerifySession)
	e.GET("/api/users", u.GetUsers, middlewares.SM.VerifySession)
	e.PUT("/api/users", u.UpdateUser, middlewares.SM.VerifySession)
	e.DELETE("/api/users/:id", u.DeleteUser, middlewares.SM.VerifySession)
}
