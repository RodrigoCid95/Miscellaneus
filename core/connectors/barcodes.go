package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"fmt"
)

type BarCodesSQLiteConnector struct{}

func (bcm BarCodesSQLiteConnector) Create(data models.NewBarCode) {
	_, err := libs.DB.Exec(
		"INSERT INTO bar_codes (name, tag, value) VALUES (?, ?, ?)",
		data.Name, data.Tag, data.Value,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesSQLiteConnector) Update(data models.BarCode) {
	_, err := libs.DB.Exec(
		"UPDATE bar_codes SET name = ?, tag = ?, value = ? WHERE rowid = ?",
		data.Name, data.Tag, data.Value, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesSQLiteConnector) Get(id int) *models.BarCode {
	var result models.BarCode

	err := libs.DB.QueryRow(
		"SELECT rowid, * FROM bar_codes WHERE rowid = ?",
		id,
	).Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
	if err != nil {
		return nil
	}
	return &result
}

func (bcm BarCodesSQLiteConnector) GetAll() []models.BarCode {
	rows, err := libs.DB.Query("SELECT rowid, * FROM bar_codes")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	results := []models.BarCode{}

	for rows.Next() {
		var result models.BarCode
		err := rows.Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (bcm BarCodesSQLiteConnector) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM bar_codes WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
