package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type ProfileSQLiteConnector struct{}

func (pm ProfileSQLiteConnector) UpdateProfile(data models.ProfileData, id int) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ? WHERE rowid = ?",
		data.UserName, data.FullName, id,
	)

	if err != nil {
		panic(err)
	}
}

func (pm ProfileSQLiteConnector) UpdatePassword(password string, id int) {
	hash := utils.GenerateHash(password)

	_, err := libs.DB.Exec(
		"UPDATE users SET hash = ? WHERE rowid = ?",
		hash, id,
	)

	if err != nil {
		panic(err)
	}
}
