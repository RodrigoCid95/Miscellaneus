package models

type ProfileData struct {
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
}

type PasswordProfileData struct {
	CurrentPassword string `json:"currentPass"`
	NewPassword     string `json:"newPass"`
}

type ProfileModel interface {
	UpdateProfile(data ProfileData, id int)
	UpdatePassword(password string, id int)
}
