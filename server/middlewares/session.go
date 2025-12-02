package middlewares

import (
	"Miscellaneous/models/structs"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
)

type SessionManager struct{}

func (s *SessionManager) VerifySession(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		sess, err := session.Get("session", c)
		if err != nil {
			return c.JSON(
				http.StatusUnauthorized,
				map[string]string{
					"code":    "required-login",
					"message": "Inicio de sesión requerido.",
				},
			)
		}
		user, ok := sess.Values["user"]
		if !ok || user == nil {
			return c.JSON(
				http.StatusUnauthorized,
				map[string]string{
					"code":    "required-login",
					"message": "Inicio de sesión requerido.",
				},
			)
		}
		return next(c)
	}
}

func (s *SessionManager) GetUserSession(c echo.Context) *structs.User {
	sess, err := session.Get("session", c)
	if err != nil {
		return nil
	}

	userVal, ok := sess.Values["user"]
	if !ok || userVal == nil {
		return nil
	}

	if u, ok := userVal.(structs.User); ok {
		return &u
	}

	return nil
}

func (s *SessionManager) RegisterSession(c echo.Context, user *structs.User) bool {
	sess, sessError := session.Get("session", c)
	if sessError != nil {
		return false
	}

	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	}

	sess.Values["user"] = user

	if err := sess.Save(c.Request(), c.Response()); err != nil {
		panic(err)
	}
	return true
}

func (s *SessionManager) UpdateSession(c echo.Context, user *structs.User) bool {
	sess, sessError := session.Get("session", c)
	if sessError != nil {
		return false
	}

	sess.Values["user"] = user

	if err := sess.Save(c.Request(), c.Response()); err != nil {
		panic(err)
	}
	return true
}
