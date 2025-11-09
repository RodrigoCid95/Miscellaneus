package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"context"
)

type BarCodesServer struct {
	grpcs.UnimplementedBarCodesServer
}

func (bcm BarCodesServer) Create(ctx context.Context, in *grpcs.NewBarCode) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"INSERT INTO bar_codes (name, tag, value) VALUES (?, ?, ?)",
		in.GetName(), in.GetTag(), in.GetValue(),
	)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (bcm BarCodesServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.BarCode, error) {
	var result grpcs.BarCode

	err := db.Client.QueryRow(
		"SELECT rowid, * FROM bar_codes WHERE rowid = ?",
		in.GetId(),
	).Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}

	return &result, nil
}

func (bcm BarCodesServer) GetAll(ctx context.Context, _ *grpcs.Empty) (*grpcs.BarCodeList, error) {
	rows, err := db.Client.Query("SELECT rowid, * FROM bar_codes")
	if err != nil {
		return nil, err
	}

	results := []*grpcs.BarCode{}
	result := &grpcs.BarCodeList{Barcodes: results}

	for rows.Next() {
		var row grpcs.BarCode
		err := rows.Scan(&row.Id, &row.Name, &row.Tag, &row.Value)
		if err != nil {
			continue
		}

		result.Barcodes = append(result.Barcodes, &row)
	}

	return result, nil
}

func (bcm BarCodesServer) Update(ctx context.Context, in *grpcs.BarCode) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE bar_codes SET name = ?, tag = ?, value = ? WHERE rowid = ?",
		in.GetName(), in.GetTag(), in.GetValue(), in.GetId(),
	)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (bcm BarCodesServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("DELETE FROM bar_codes WHERE rowid = ?", in.GetId())
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}
