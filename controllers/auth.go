package controllers

import (
	"Miscellaneous/models"
	"Miscellaneous/utils"
)

type Credentials struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

type Auth struct{}

func (a *Auth) Login(c Credentials) (bool, error) {
	if c.UserName == "" {
		return false, utils.NewError("missing-username", "El nombre de usuario es requerido.")
	}
	if c.Password == "" {
		return false, utils.NewError("missing-password", "La contraseña es requerida.")
	}
	result := models.Users.Get(c.UserName)
	if result == nil {
		return false, utils.NewError("user-not-found", "Usuario no encontrado.")
	}

	hash := utils.GenerateHash(c.Password)
	if hash != result.Hash {
		return false, utils.NewError("wrong-password", "La contraseña es incorrecta.")
	}
	profile = &models.User{
		Id:       result.Id,
		UserName: result.UserName,
		FullName: result.FullName,
		IsAdmin:  result.IsAdmin,
	}
	return true, nil
}

func (a *Auth) Logout() {
	profile = nil
}
