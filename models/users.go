package models

import (
	"Miscellaneous/libs"
	"Miscellaneous/utils"
)

type User struct {
	Id       int    `json:"id"`
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
	IsAdmin  bool   `json:"isAdmin"`
}

type UserResult struct {
	Id       int    `json:"id"`
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
	IsAdmin  bool   `json:"isAdmin"`
	Hash     string `json:"hash"`
}

type NewUser struct {
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
	IsAdmin  bool   `json:"isAdmin"`
	Password string `json:"password"`
}

type UsersModel struct{}

func (um *UsersModel) Create(newUser NewUser) {
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

func (um *UsersModel) Get(userName string) *UserResult {
	var result UserResult

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

func (um *UsersModel) GetAll() *[]User {
	rows, err := libs.DB.Query("SELECT rowid, user_name, full_name, hash, is_admin FROM users")
	if err != nil {
		return nil
	}

	var results []User

	for rows.Next() {
		var result UserResult
		err := rows.Scan(&result.Id, &result.UserName, &result.FullName, &result.Hash, &result.IsAdmin)
		if err != nil {
			continue
		}

		user := User{
			Id:       result.Id,
			UserName: result.UserName,
			FullName: result.FullName,
			IsAdmin:  result.IsAdmin,
		}
		results = append(results, user)
	}

	return &results
}

func (um *UsersModel) Update(user User) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ?, is_admin = ? WHERE rowid = ?",
		user.UserName, user.FullName, user.IsAdmin, user.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (um *UsersModel) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM users WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
