package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"context"
)

type CheckoutServer struct {
	grpcs.UnimplementedCheckoutServer
}

func (cm CheckoutServer) CreateSale(ctx context.Context, in *grpcs.CreateSaleArgs) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)",
		in.Sale.Product, in.IdUser, in.Date, in.Sale.Count, in.Sale.Total,
	)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (cm CheckoutServer) GetHistory(ctx context.Context, in *grpcs.IdRequest) (*grpcs.SalesList, error) {
	rows, err := db.Client.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product INNER JOIN providers ON providers.ROWID = products.provider WHERE sales.id_user = ?",
		in.GetId(),
	)
	if err != nil {
		return nil, err
	}

	results := []*grpcs.Sale{}
	result := &grpcs.SalesList{Sales: results}
	for rows.Next() {
		row := &grpcs.Sale{}
		err := rows.Scan(&row.Id, &row.Product, &row.User, &row.Date, &row.Count, &row.Total)
		if err != nil {
			continue
		}

		result.Sales = append(result.Sales, row)
	}

	return result, nil
}

func (cm CheckoutServer) DeleteSale(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("DELETE FROM sales WHERE rowid = ?", in.GetId())
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}
