package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
)

type Credentials struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

type Auth struct{}

func (a *Auth) Login(c Credentials) (bool, error) {
	user, err := modules.Auth.Login(interfaces.LoginArgs{
		UserName: c.UserName,
		Password: c.Password,
	})
	if err != nil {
		return false, errors.ProcessError(err)
	}

	profile = &structs.User{
		Id:       user.Id,
		UserName: user.UserName,
		FullName: user.FullName,
		IsAdmin:  user.IsAdmin,
	}
	return true, nil
}

func (a *Auth) Logout() {
	profile = nil
}
