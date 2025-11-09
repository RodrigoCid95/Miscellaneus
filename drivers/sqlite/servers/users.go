package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"Miscellaneous/utils/crypto"
	"context"
)

type UsersServer struct {
	grpcs.UnimplementedUsersServer
}

func (um UsersServer) Create(ctx context.Context, in *grpcs.NewUser) (*grpcs.Empty, error) {
	hash := crypto.GenerateHash(in.GetPassword())

	_, err := db.Client.Exec(
		"INSERT INTO users (user_name, full_name, hash, is_admin) VALUES (?, ?, ?, ?)",
		in.GetUserName(),
		in.GetFullName(),
		hash,
		in.GetIsAdmin(),
	)

	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (um UsersServer) Get(ctx context.Context, in *grpcs.UserNameRequest) (*grpcs.GetUserResult, error) {
	var user grpcs.UserResult

	err := db.Client.QueryRow(
		"SELECT rowid, user_name, full_name, hash, is_admin FROM users WHERE user_name = ?",
		in.GetUserName(),
	).Scan(
		&user.Id,
		&user.UserName,
		&user.FullName,
		&user.Hash,
		&user.IsAdmin,
	)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}
	return &grpcs.GetUserResult{User: &user}, nil
}

func (um UsersServer) GetAll(ctx context.Context, in *grpcs.Empty) (*grpcs.UserList, error) {
	rows, err := db.Client.Query("SELECT rowid, user_name, full_name, hash, is_admin FROM users")
	if err != nil {
		return nil, err
	}

	results := []*grpcs.User{}
	result := &grpcs.UserList{Users: results}
	for rows.Next() {
		var row grpcs.UserResult
		err := rows.Scan(&row.Id, &row.UserName, &row.FullName, &row.Hash, &row.IsAdmin)
		if err != nil {
			continue
		}

		user := grpcs.User{
			Id:       row.Id,
			UserName: row.UserName,
			FullName: row.FullName,
			IsAdmin:  row.IsAdmin,
		}
		result.Users = append(result.Users, &user)
	}

	return result, nil
}

func (um UsersServer) Update(ctx context.Context, in *grpcs.User) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE users SET user_name = ?, full_name = ?, is_admin = ? WHERE rowid = ?",
		in.GetUserName(), in.GetFullName(), in.GetIsAdmin(), in.GetId(),
	)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (um UsersServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("DELETE FROM users WHERE rowid = ?", in.GetId())
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}
