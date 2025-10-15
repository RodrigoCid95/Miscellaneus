package models

import (
	"Miscellaneous/libs"
	"Miscellaneous/utils"
)

type ProfileData struct {
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
}

type PasswordProfileData struct {
	CurrentPassword string `json:"currentPass"`
	NewPassword     string `json:"newPass"`
}

type ProfileModel struct{}

func (pm *ProfileModel) UpdateProfile(data ProfileData, id int) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ? WHERE rowid = ?",
		data.UserName, data.FullName, id,
	)

	if err != nil {
		panic(err)
	}
}

func (pm *ProfileModel) UpdatePassword(password string, id int) {
	hash := utils.GenerateHash(password)

	_, err := libs.DB.Exec(
		"UPDATE users SET hash = ? WHERE rowid = ?",
		hash, id,
	)

	if err != nil {
		panic(err)
	}
}
