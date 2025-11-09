package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"Miscellaneous/utils/crypto"
	"context"
)

type ProfileServer struct {
	grpcs.UnimplementedProfileServer
}

func (pm ProfileServer) UpdateProfile(ctx context.Context, in *grpcs.UpdateProfileArgs) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE users SET user_name = ?, full_name = ? WHERE rowid = ?",
		in.GetData().GetUserName(), in.GetData().GetFullName(), in.GetId(),
	)

	if err != nil {
		panic(err)
	}

	return &grpcs.Empty{}, nil
}

func (pm ProfileServer) UpdatePassword(ctx context.Context, in *grpcs.UpdatePasswordArgs) (*grpcs.Empty, error) {
	hash := crypto.GenerateHash(in.GetPassword())

	_, err := db.Client.Exec(
		"UPDATE users SET hash = ? WHERE rowid = ?",
		hash, in.GetId(),
	)

	if err != nil {
		panic(err)
	}

	return &grpcs.Empty{}, nil
}
