package controllers

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type Profile struct{}

func (p *Profile) GetProfile() *models.User {
	return profile
}

func (p *Profile) UpdateProfile(data models.ProfileData) error {
	if data.UserName == "" {
		return utils.NewError("user-name-not-found", "Falta el nombre de usuario.")
	}
	if data.FullName == "" {
		return utils.NewError("name-not-found", "Falta el nombre completo.")
	}

	if profile == nil {
		return nil
	}

	result := models.Users.Get(data.UserName)
	if result != nil && result.Id != profile.Id {
		return utils.NewError("user-already-exists", "El usuario "+data.UserName+" ya existe.")
	}

	models.Profile.UpdateProfile(data, profile.Id)

	return nil
}

func (p *Profile) UpdatePassword(data models.PasswordProfileData) error {
	if data.CurrentPassword == "" || data.NewPassword == "" {
		return utils.NewError("fields-required", "Faltan parámetros.")
	}

	if profile == nil {
		return nil
	}

	result := models.Users.Get(profile.UserName)
	hash := utils.GenerateHash(data.CurrentPassword)

	if result.Hash != hash {
		return utils.NewError("password-invalid", "La contraseña es incorrecta.")
	}

	models.Profile.UpdatePassword(data.NewPassword, profile.Id)

	return nil
}
