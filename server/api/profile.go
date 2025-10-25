package api

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Profile struct{}

func (p *Profile) GetProfile(c echo.Context) error {
	return c.JSON(http.StatusOK, middlewares.SM.GetUserSession(c))
}

func (p *Profile) UpdateProfile(c echo.Context) error {
	var data models.ProfileData
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "Datos requeridos."))
	}

	if data.UserName == "" {
		return c.JSON(utils.APIBadRequest("user-name-not-found", "Falta el nombre de usuario."))
	}
	if data.FullName == "" {
		return c.JSON(utils.APIBadRequest("name-not-found", "Falta el nombre completo."))
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusAccepted)
	}

	result := models.Users.Get(data.UserName)
	if result != nil && result.Id != profile.Id {
		return c.JSON(utils.APIBadRequest("user-already-exist", "El usuario "+data.UserName+" ya existe."))
	}

	models.Profile.UpdateProfile(data, profile.Id)

	return c.NoContent(http.StatusAccepted)
}

func (p *Profile) UpdatePassword(c echo.Context) error {
	var data models.PasswordProfileData
	if err := c.Bind(&data); err != nil {
		return c.JSON(utils.APIBadRequest("missing-data", "No hay datos."))
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusAccepted)
	}

	result := models.Users.Get(profile.UserName)
	hash := utils.GenerateHash(data.CurrentPassword)

	if result.Hash != hash {
		return c.JSON(utils.APIBadRequest("password-invalida", "La contraseña es incorrecta."))
	}

	models.Profile.UpdatePassword(data.NewPassword, profile.Id)

	return c.NoContent(http.StatusAccepted)
}

func RegisterProfileAPI(e *echo.Echo) {
	p := Profile{}

	e.GET("/api/profile", p.GetProfile)
	e.PUT("/api/profile", p.UpdateProfile, middlewares.SM.VerifySession)
}
