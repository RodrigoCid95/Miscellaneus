package controllers

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type Users struct{}

func (u *Users) CreateUser(newUser models.NewUser) error {
	if newUser.UserName == "" {
		return utils.NewError("user-name-not-found", "Falta el nombre de usuario.")
	}
	if newUser.FullName == "" {
		return utils.NewError("name-not-found", "Falta el nombre completo.")
	}

	user := core.Users.Get(newUser.UserName)
	if user != nil {
		return utils.NewError("user-already", "El usuario "+newUser.UserName+" ya existe.")
	}

	core.Users.Create(newUser)

	return nil
}

func (u *Users) GetUsers() []models.User {
	results := []models.User{}

	userList := core.Users.GetAll()
	for _, user := range userList {
		if user.Id != profile.Id {
			results = append(results, user)
		}
	}

	return results
}

func (u *Users) UpdateUser(user models.User) error {
	if user.UserName == "" {
		return utils.NewError("user-name-not-found", "Falta el nombre de usuario.")
	}
	if user.FullName == "" {
		return utils.NewError("name-not-found", "Falta el nombre completo.")
	}

	result := core.Users.Get(user.UserName)
	if result != nil && result.Id != user.Id {
		return utils.NewError("user-already", "El usuario "+user.UserName+" ya existe.")
	}

	core.Users.Update(user)

	return nil
}

func (u *Users) DeleteUser(id string) {
	core.Users.Delete(id)
}
