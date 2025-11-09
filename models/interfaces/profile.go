package interfaces

import "Miscellaneous/models/structs"

type UpdateProfileArgs struct {
	Data structs.ProfileData
	Id   string
}

type UpdatePasswordArgs struct {
	Profile *structs.User
	Data    structs.PasswordProfileData
}

type ProfileModel interface {
	UpdateProfile(args UpdateProfileArgs) *structs.CoreError
	UpdatePassword(args UpdatePasswordArgs) *structs.CoreError
}
