package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type Users struct{}

func (u *Users) CreateUser(newUser structs.NewUser) error {
	if err := modules.Users.Create(newUser); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (u *Users) GetUsers() []structs.User {
	results, _ := modules.Users.GetAll(profile)

	return results
}

func (u *Users) UpdateUser(user structs.User) error {
	if err := modules.Users.Update(user); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (u *Users) DeleteUser(id string) error {
	if err := modules.Users.Delete(id); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}
