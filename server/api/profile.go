package api

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/server/errors"
	"Miscellaneous/server/middlewares"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Profile struct{}

func (p *Profile) GetProfile(c echo.Context) error {
	return c.JSON(http.StatusOK, middlewares.SM.GetUserSession(c))
}

func (p *Profile) UpdateProfile(c echo.Context) error {
	var data structs.ProfileData
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "Datos requeridos.",
		}, c)
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusAccepted)
	}

	err := modules.Profile.UpdateProfile(interfaces.UpdateProfileArgs{
		Data: data,
		Id:   profile.Id,
	})
	if err != nil {
		return errors.ProcessError(err, c)
	}

	middlewares.SM.UpdateSession(c, profile)
	return c.NoContent(http.StatusAccepted)
}

func (p *Profile) UpdatePassword(c echo.Context) error {
	var data structs.PasswordProfileData
	if err := c.Bind(&data); err != nil {
		return errors.ProcessError(&structs.CoreError{
			IsInternal: false,
			Code:       "missing-data",
			Message:    "No hay datos.",
		}, c)
	}

	profile := middlewares.SM.GetUserSession(c)
	if profile == nil {
		return c.NoContent(http.StatusAccepted)
	}

	err := modules.Profile.UpdatePassword(interfaces.UpdatePasswordArgs{
		Profile: profile,
		Data:    data,
	})
	if err != nil {
		return errors.ProcessError(err, c)
	}

	return c.NoContent(http.StatusAccepted)
}

func RegisterProfileAPI(e *echo.Echo) {
	p := Profile{}

	e.GET("/api/profile", p.GetProfile)
	e.PUT("/api/profile", p.UpdateProfile, middlewares.SM.VerifySession)
	e.POST("/api/profile", p.UpdatePassword, middlewares.SM.VerifySession)
}
