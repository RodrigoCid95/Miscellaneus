package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
)

type Profile struct{}

func (p *Profile) GetProfile() *structs.User {
	return profile
}

func (p *Profile) UpdateProfile(data structs.ProfileData) error {
	if profile == nil {
		return nil
	}

	err := modules.Profile.UpdateProfile(interfaces.UpdateProfileArgs{
		Data: data,
		Id:   profile.Id,
	})
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (p *Profile) UpdatePassword(data structs.PasswordProfileData) error {
	if profile == nil {
		return nil
	}

	err := modules.Profile.UpdatePassword(interfaces.UpdatePasswordArgs{
		Profile: profile,
		Data:    data,
	})
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}
