package models

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

type UsersModel interface {
	Create(newUser NewUser)
	Get(userName string) *UserResult
	GetAll() *[]User
	Update(user User)
	Delete(id int)
}
