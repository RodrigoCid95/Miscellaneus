package models

import "Miscellaneous/core/libs"

type Sale struct {
	Id      int     `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int     `json:"count"`
	Total   float32 `json:"total"`
}

type NewSale struct {
	Product int `json:"product"`
	Count   int `json:"count"`
	Total   int `json:"total"`
}

type CheckoutModel struct{}

func (cm *CheckoutModel) CreateSale(sale NewSale, idUSer int, date int64) {
	_, err := libs.DB.Exec(
		"INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)",
		sale.Product, idUSer, date, sale.Count, sale.Total,
	)
	if err != nil {
		panic(err)
	}
}

func (cm *CheckoutModel) GetHistory(id int) []Sale {
	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product INNER JOIN providers ON providers.ROWID = products.provider WHERE sales.id_user = ?",
		id,
	)
	if err != nil {
		panic(err)
	}

	results := []Sale{}

	for rows.Next() {
		result := Sale{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (cm *CheckoutModel) DeleteSale(id int) {
	_, err := libs.DB.Exec("DELETE FROM sales WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
