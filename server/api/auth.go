package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
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
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-credentials",
			Message:    "Credenciales requeridas.",
		}, c)
	}

	user, err := modules.Auth.Login(interfaces.LoginArgs{
		UserName: credentials.UserName,
		Password: credentials.Password,
	})
	if err != nil {
		return errors.ProcessError(err, c)
	}

	middlewares.SM.RegisterSession(c, &structs.User{
		Id:       user.Id,
		UserName: user.UserName,
		FullName: user.FullName,
		IsAdmin:  user.IsAdmin,
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
