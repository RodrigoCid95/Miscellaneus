package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
)

type HistorySQLiteConnector struct{}

func (hm HistorySQLiteConnector) FindByID(id int) *models.SaleResult {
	result := models.SaleResult{}

	err := libs.DB.QueryRow(
		"SELECT rowid, * FROM sales WHERE rowid = ?",
		id,
	).Scan(
		&result.Id,
		&result.IdProduct,
		&result.IdUser,
		&result.Date,
		&result.Count,
		&result.Total,
	)
	if err != nil {
		return nil
	}

	return &result
}

func (hm HistorySQLiteConnector) GetByRange(start int64, end int64) []models.HistoryItem {
	results := []models.HistoryItem{}

	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product WHERE sales.date > ? AND sales.date < ?",
		start, end,
	)
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		result := models.HistoryItem{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}
