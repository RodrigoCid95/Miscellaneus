package models

import (
	"Miscellaneous/libs"
)

type NewProduct struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Sku         string `json:"sku"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
	MinStock    int    `json:"minStock"`
	IdProvider  int    `json:"idProvider"`
}

type Product struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Sku         string   `json:"sku"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	MinStock    int      `json:"minStock"`
	Provider    Provider `json:"provider"`
}

type ProductGroup struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Sku         string   `json:"sku"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	MinStock    int      `json:"minStock"`
	Provider    Provider `json:"provider"`
	Count       int      `json:"count"`
}

type DataProduct struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Sku         string `json:"sku"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
	MinStock    int    `json:"minStock"`
	IdProvider  int    `json:"idProvider"`
}

type ProductsModel struct{}

func (pm *ProductsModel) GetAll() []Product {
	rows, err := libs.DB.Query("SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID")
	if err != nil {
		panic(err)
	}

	results := []Product{}

	for rows.Next() {
		result := Product{}
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

func (pm *ProductsModel) Get(id int) *Product {
	var result Product

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

func (pm *ProductsModel) Find(query string) []Product {
	query = "%" + query + "%"
	rows, err := libs.DB.Query(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.name LIKE ? OR products.sku LIKE ?",
		query, query,
	)
	if err != nil {
		panic(err)
	}

	results := []Product{}

	for rows.Next() {
		result := Product{}
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

func (pm *ProductsModel) Create(data NewProduct) {
	_, err := libs.DB.Exec(
		"INSERT INTO products (name, description, sku, price, stock, min_stock, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
		&data.Name, &data.Description, &data.Sku, &data.Price, &data.Stock, &data.MinStock, &data.IdProvider,
	)

	if err != nil {
		panic(err)
	}
}

func (pm *ProductsModel) Update(data DataProduct) {
	_, err := libs.DB.Exec(
		"UPDATE products SET name = ?, description = ?, sku = ?, price = ?, stock = ?, min_stock = ?, provider = ? WHERE rowid = ?",
		data.Name, data.Description, data.Sku, data.Price, data.Stock, data.MinStock, data.IdProvider, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm *ProductsModel) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM products WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
