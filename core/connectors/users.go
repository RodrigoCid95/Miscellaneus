package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type UsersSQLiteConnector struct{}

func (um UsersSQLiteConnector) Create(newUser models.NewUser) {
	hash := utils.GenerateHash(newUser.Password)

	_, err := libs.DB.Exec(
		"INSERT INTO users (user_name, full_name, hash, is_admin) VALUES (?, ?, ?, ?)",
		newUser.UserName,
		newUser.FullName,
		hash,
		newUser.IsAdmin,
	)

	if err != nil {
		panic(err)
	}
}

func (um UsersSQLiteConnector) Get(userName string) *models.UserResult {
	var result models.UserResult

	err := libs.DB.QueryRow(
		"SELECT rowid, user_name, full_name, hash, is_admin FROM users WHERE user_name = ?",
		userName,
	).Scan(
		&result.Id,
		&result.UserName,
		&result.FullName,
		&result.Hash,
		&result.IsAdmin,
	)
	if err != nil {
		return nil
	}
	return &result
}

func (um UsersSQLiteConnector) GetAll() *[]models.User {
	rows, err := libs.DB.Query("SELECT rowid, user_name, full_name, hash, is_admin FROM users")
	if err != nil {
		return nil
	}

	var results []models.User

	for rows.Next() {
		var result models.UserResult
		err := rows.Scan(&result.Id, &result.UserName, &result.FullName, &result.Hash, &result.IsAdmin)
		if err != nil {
			continue
		}

		user := models.User{
			Id:       result.Id,
			UserName: result.UserName,
			FullName: result.FullName,
			IsAdmin:  result.IsAdmin,
		}
		results = append(results, user)
	}

	return &results
}

func (um UsersSQLiteConnector) Update(user models.User) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ?, is_admin = ? WHERE rowid = ?",
		user.UserName, user.FullName, user.IsAdmin, user.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (um UsersSQLiteConnector) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM users WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
