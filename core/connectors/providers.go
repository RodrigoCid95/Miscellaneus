package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
)

type ProvidersSQLiteConnector struct{}

func (pm ProvidersSQLiteConnector) GetAll() *[]models.Provider {
	rows, err := libs.DB.Query("SELECT rowid, * FROM providers")
	if err != nil {
		return nil
	}

	results := []models.Provider{}

	for rows.Next() {
		var row models.Provider
		err := rows.Scan(&row.Id, &row.Name, &row.Phone)
		if err != nil {
			continue
		}

		results = append(results, row)
	}

	return &results
}

func (pm ProvidersSQLiteConnector) Get(id int) *models.Provider {
	var result models.Provider

	err := libs.DB.QueryRow("SELECT rowid, * WHERE rowid = ?", id).Scan(result.Id, result.Name, result.Phone)
	if err != nil {
		return nil
	}

	return &result
}

func (pm ProvidersSQLiteConnector) Create(data models.NewProvider) {
	_, err := libs.DB.Exec("INSERT INTO providers (name, phone) VALUES (?, ?)", data.Name, data.Phone)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersSQLiteConnector) Update(data models.Provider) {
	_, err := libs.DB.Exec(
		"UPDATE providers SET name = ?, phone = ? WHERE rowid = ?",
		data.Name, data.Phone, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersSQLiteConnector) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM providers WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
