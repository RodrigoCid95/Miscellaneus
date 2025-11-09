package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"context"
)

type ProvidersServer struct {
	grpcs.UnimplementedProvidersServer
}

func (pm ProvidersServer) GetAll(ctx context.Context, in *grpcs.Empty) (*grpcs.ProviderList, error) {
	rows, err := db.Client.Query("SELECT rowid, * FROM providers")
	if err != nil {
		return nil, err
	}

	results := []*grpcs.Provider{}
	result := &grpcs.ProviderList{Providers: results}
	for rows.Next() {
		var row grpcs.Provider
		err := rows.Scan(&row.Id, &row.Name, &row.Phone)
		if err != nil {
			continue
		}

		result.Providers = append(result.Providers, &row)
	}

	return result, nil
}

func (pm ProvidersServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Provider, error) {
	var result grpcs.Provider

	err := db.Client.QueryRow("SELECT rowid, * WHERE rowid = ?", in.GetId()).Scan(&result.Id, &result.Name, &result.Phone)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}

	return &result, nil
}

func (pm ProvidersServer) Create(ctx context.Context, in *grpcs.NewProvider) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("INSERT INTO providers (name, phone) VALUES (?, ?)", in.GetName(), in.GetPhone())
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProvidersServer) Update(ctx context.Context, in *grpcs.Provider) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE providers SET name = ?, phone = ? WHERE rowid = ?",
		in.GetName(), in.GetPhone(), in.GetId(),
	)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProvidersServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("DELETE FROM providers WHERE rowid = ?", in.GetId())
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}
