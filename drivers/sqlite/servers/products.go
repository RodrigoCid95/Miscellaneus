package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/sqlite/db"
	"context"
)

type ProductsServer struct {
	grpcs.UnimplementedProductsServer
}

func (pm ProductsServer) GetAll(ctx context.Context, in *grpcs.Empty) (*grpcs.ProductList, error) {
	rows, err := db.Client.Query("SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID")
	if err != nil {
		return nil, err
	}

	results := []*grpcs.Product{}
	result := &grpcs.ProductList{Products: results}
	for rows.Next() {
		row := grpcs.Product{}
		err = rows.Scan(
			&row.Id,
			&row.Name,
			&row.Description,
			&row.Sku,
			&row.Price,
			&row.Stock,
			&row.MinStock,
			&row.Provider.Id,
			&row.Provider.Name,
			&row.Provider.Phone,
		)
		if err != nil {
			continue
		}

		result.Products = append(result.Products, &row)
	}

	return result, nil
}

func (pm ProductsServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Product, error) {
	var result grpcs.Product

	err := db.Client.QueryRow(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.ROWID = ?",
		in.GetId(),
	).Scan(
		&result.Id,
		&result.Name,
		&result.Description,
		&result.Sku,
		&result.Price,
		&result.Stock,
		&result.MinStock,
		&result.Provider.Id,
		&result.Provider.Name,
		&result.Provider.Phone,
	)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return nil, nil
		}
		return nil, err
	}

	return &result, nil
}

func (pm ProductsServer) Find(ctx context.Context, in *grpcs.QueryRequest) (*grpcs.ProductList, error) {
	query := "%" + in.GetQuery() + "%"
	rows, err := db.Client.Query(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.name LIKE ? OR products.sku LIKE ?",
		query, query,
	)
	if err != nil {
		return nil, err
	}

	results := grpcs.ProductList{}

	for rows.Next() {
		result := grpcs.Product{}
		err = rows.Scan(
			&result.Id,
			&result.Name,
			&result.Description,
			&result.Sku,
			&result.Price,
			&result.Stock,
			&result.MinStock,
			&result.Provider.Id,
			&result.Provider.Name,
			&result.Provider.Phone,
		)
		if err != nil {
			continue
		}

		results.Products = append(results.Products, &result)
	}

	return &results, nil
}

func (pm ProductsServer) Create(ctx context.Context, in *grpcs.NewProduct) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"INSERT INTO products (name, description, sku, price, stock, min_stock, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
		in.GetName(), in.GetDescription(), in.GetSku(), in.GetPrice(), in.GetStock(), in.GetMinStock(), in.GetIdProvider(),
	)

	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) Update(ctx context.Context, in *grpcs.DataProduct) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE products SET name = ?, description = ?, sku = ?, price = ?, stock = ?, min_stock = ?, provider = ? WHERE rowid = ?",
		in.GetName(), in.GetDescription(), in.GetSku(), in.GetPrice(), in.GetStock(), in.GetMinStock(), in.GetIdProvider(), in.GetId(),
	)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	_, err := db.Client.Exec("DELETE FROM products WHERE rowid = ?", in.GetId())
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) UpdateStock(ctx context.Context, in *grpcs.UpdateStockArgs) (*grpcs.Empty, error) {
	_, err := db.Client.Exec(
		"UPDATE products SET stock = stock - ? WHERE rowid = ?",
		in.GetStock(), in.GetId(),
	)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}
