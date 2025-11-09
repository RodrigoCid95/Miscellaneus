package structs

type ProfileData struct {
	UserName string `json:"userName"`
	FullName string `json:"fullName"`
}

type PasswordProfileData struct {
	CurrentPassword string `json:"currentPass"`
	NewPassword     string `json:"newPass"`
}
