package models

import "Miscellaneous/libs"

type History struct {
	Id      int     `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int     `json:"count"`
	Total   float32 `json:"total"`
}

type SaleResult struct {
	Id        int   `json:"id"`
	IdProduct int   `json:"idProduct"`
	IdUser    int   `json:"idUser"`
	Date      int64 `json:"date"`
	Count     int   `json:"count"`
	Total     int   `json:"total"`
}

type HistoryModel struct{}

func (hm *HistoryModel) FindByID(id int) *SaleResult {
	result := SaleResult{}

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

func (hm *HistoryModel) GetByRange(start int64, end int64) []History {
	results := []History{}

	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product WHERE sales.date > ? AND sales.date < ?",
		start, end,
	)
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		result := History{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}
