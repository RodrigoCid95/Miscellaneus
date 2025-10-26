package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
)

type CheckoutSQLiteConnector struct{}

func (cm CheckoutSQLiteConnector) CreateSale(sale models.NewSale, idUSer int, date int64) {
	_, err := libs.DB.Exec(
		"INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)",
		sale.Product, idUSer, date, sale.Count, sale.Total,
	)
	if err != nil {
		panic(err)
	}
}

func (cm CheckoutSQLiteConnector) GetHistory(id int) []models.Sale {
	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product INNER JOIN providers ON providers.ROWID = products.provider WHERE sales.id_user = ?",
		id,
	)
	if err != nil {
		panic(err)
	}

	results := []models.Sale{}

	for rows.Next() {
		result := models.Sale{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (cm CheckoutSQLiteConnector) DeleteSale(id int) {
	_, err := libs.DB.Exec("DELETE FROM sales WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
