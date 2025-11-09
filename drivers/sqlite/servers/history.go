package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"context"
)

type HistoryServer struct {
	grpcs.UnimplementedHistoryServer
}

func (hm HistoryServer) FindByID(ctx context.Context, in *grpcs.IdRequest) (*grpcs.SaleResult, error) {
	result := grpcs.SaleResult{}

	err := db.Client.QueryRow(
		"SELECT rowid, * FROM sales WHERE rowid = ?",
		in.GetId(),
	).Scan(
		&result.Id,
		&result.IdProduct,
		&result.IdUser,
		&result.Date,
		&result.Count,
		&result.Total,
	)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}

	return &result, nil
}

func (hm HistoryServer) GetByRange(ctx context.Context, in *grpcs.GetByRangeArgs) (*grpcs.HistoryList, error) {
	rows, err := db.Client.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product WHERE sales.date > ? AND sales.date < ?",
		in.Start, in.End,
	)
	if err != nil {
		return nil, err
	}

	results := []*grpcs.HistoryItem{}
	result := &grpcs.HistoryList{Items: results}
	for rows.Next() {
		row := grpcs.HistoryItem{}
		err := rows.Scan(&row.Id, &row.Product, &row.User, &row.Date, &row.Count, &row.Total)
		if err != nil {
			continue
		}

		result.Items = append(result.Items, &row)
	}

	return result, nil
}
