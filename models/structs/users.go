package structs

import (
	"encoding/gob"
)

type User struct {
	Id       string `json:"id"`
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
	IsAdmin  bool   `json:"isAdmin"`
}

type UserResult struct {
	Id       string `json:"id"`
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
	IsAdmin  bool   `json:"isAdmin"`
	Hash     string `json:"hash"`
}

type NewUser struct {
	UserName string `json:"userName" bson:"user_name"`
	FullName string `json:"fullName" bson:"full_name"`
	IsAdmin  bool   `json:"isAdmin" bson:"is_admin"`
	Password string `json:"password" bson:"password"`
}

func init() {
	gob.Register(User{})
	gob.Register([]User{})
}
