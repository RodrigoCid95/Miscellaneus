package api

import (
	"Miscellaneous/models"
	"Miscellaneous/server/middlewares"
	"Miscellaneous/utils"
	"net/http"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type Credentials struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

type AuthAPI struct{}

func (a *AuthAPI) Login(c echo.Context) error {
	var credentials Credentials
	if err := c.Bind(&credentials); err != nil {
		return c.JSON(utils.APIBadRequest("missing-credentials", "Credenciales requeridas."))
	}

	if credentials.UserName == "" {
		return c.JSON(utils.APIBadRequest("missing-username", "El nombre de usuario es requerido."))
	}
	if credentials.Password == "" {
		return c.JSON(utils.APIBadRequest("missing-password", "La contraseña es requerida."))
	}

	result := models.Users.Get(credentials.UserName)
	if result == nil {
		return c.JSON(utils.APIBadRequest("user-not-found", "Usuario no encontrado."))
	}

	hash := utils.GenerateHash(credentials.Password)
	if hash != result.Hash {
		return c.JSON(utils.APIBadRequest("wrong-password", "La contraseña es incorrecta."))
	}

	middlewares.SM.RegisterSession(c, &models.User{
		Id:       result.Id,
		UserName: result.UserName,
		FullName: result.FullName,
		IsAdmin:  result.IsAdmin,
	})

	return c.NoContent(http.StatusAccepted)
}

func (a *AuthAPI) Logout(c echo.Context) error {
	sess, _ := session.Get("session", c)
	delete(sess.Values, "user")
	sess.Save(c.Request(), c.Response())
	return c.JSON(http.StatusOK, true)
}

func RegisterAuthAPI(e *echo.Echo) {
	auth := AuthAPI{}

	e.POST("/api/auth", auth.Login)
	e.DELETE("/api/auth", auth.Logout)
}
