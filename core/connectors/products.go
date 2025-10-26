package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
)

type ProductsSQLiteConnector struct{}

func (pm ProductsSQLiteConnector) GetAll() []models.Product {
	rows, err := libs.DB.Query("SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID")
	if err != nil {
		panic(err)
	}

	results := []models.Product{}

	for rows.Next() {
		result := models.Product{}
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

		results = append(results, result)
	}

	return results
}

func (pm ProductsSQLiteConnector) Get(id int) *models.Product {
	var result models.Product

	err := libs.DB.QueryRow(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.ROWID = ?",
		id,
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
		return nil
	}

	return &result
}

func (pm ProductsSQLiteConnector) Find(query string) []models.Product {
	query = "%" + query + "%"
	rows, err := libs.DB.Query(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.name LIKE ? OR products.sku LIKE ?",
		query, query,
	)
	if err != nil {
		panic(err)
	}

	results := []models.Product{}

	for rows.Next() {
		result := models.Product{}
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

		results = append(results, result)
	}

	return results
}

func (pm ProductsSQLiteConnector) Create(data models.NewProduct) {
	_, err := libs.DB.Exec(
		"INSERT INTO products (name, description, sku, price, stock, min_stock, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
		&data.Name, &data.Description, &data.Sku, &data.Price, &data.Stock, &data.MinStock, &data.IdProvider,
	)

	if err != nil {
		panic(err)
	}
}

func (pm ProductsSQLiteConnector) Update(data models.DataProduct) {
	_, err := libs.DB.Exec(
		"UPDATE products SET name = ?, description = ?, sku = ?, price = ?, stock = ?, min_stock = ?, provider = ? WHERE rowid = ?",
		data.Name, data.Description, data.Sku, data.Price, data.Stock, data.MinStock, data.IdProvider, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm ProductsSQLiteConnector) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM products WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
