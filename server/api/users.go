package api

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type UsersAPI struct{}

func (u *UsersAPI) CreateUser(c echo.Context) error {
	var data models.NewUser
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}
	if data.UserName == "" {
		return c.JSON(utils.APIBadRequest("user-name-not-found", "Falta el nombre de usuario."))
	}
	if data.FullName == "" {
		return c.JSON(utils.APIBadRequest("name-not-found", "Falta el nombre completo."))
	}

	user := models.Users.Get(data.UserName)
	if user != nil {
		return c.JSON(utils.APIBadRequest("user-already", "El usuario "+data.UserName+" ya existe."))
	}

	models.Users.Create(data)

	return c.NoContent(http.StatusAccepted)
}

func (u *UsersAPI) GetUsers(c echo.Context) error {
	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.JSON(http.StatusOK, []any{})
	}

	results := []models.User{}

	userList := models.Users.GetAll()
	for _, user := range *userList {
		if user.Id != profile.Id {
			results = append(results, user)
		}
	}

	return c.JSON(http.StatusOK, results)
}

func (u *UsersAPI) UpdateUser(c echo.Context) error {
	var data models.User
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.UserName == "" {
		return utils.NewError("user-name-not-found", "Falta el nombre de usuario.")
	}
	if data.FullName == "" {
		return utils.NewError("name-not-found", "Falta el nombre completo.")
	}

	result := models.Users.Get(data.UserName)
	if result != nil && result.Id != data.Id {
		return utils.NewError("user-already", "El usuario "+data.UserName+" ya existe.")
	}

	models.Users.Update(data)

	return c.NoContent(http.StatusAccepted)
}

func (u *UsersAPI) DeleteUser(c echo.Context) error {
	strId := c.Param("id")
	id, err := strconv.Atoi(strId)
	if err != nil {
		return c.NoContent(http.StatusAccepted)
	}

	models.Users.Delete(id)
	return c.NoContent(http.StatusAccepted)
}

func RegisterUsersAPI(e *echo.Echo) {
	u := UsersAPI{}

	e.POST("/api/users", u.CreateUser, middlewares.SM.VerifySession)
	e.GET("/api/users", u.GetUsers, middlewares.SM.VerifySession)
	e.PUT("/api/users", u.UpdateUser, middlewares.SM.VerifySession)
	e.DELETE("/api/users/:id", u.DeleteUser, middlewares.SM.VerifySession)
}
