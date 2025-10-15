package models

import "Miscellaneous/libs"

type Provider struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type NewProvider struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type ProvidersModel struct{}

func (pm *ProvidersModel) GetAll() *[]Provider {
	rows, err := libs.DB.Query("SELECT rowid, * FROM providers")
	if err != nil {
		return nil
	}

	results := []Provider{}

	for rows.Next() {
		var row Provider
		err := rows.Scan(&row.Id, &row.Name, &row.Phone)
		if err != nil {
			continue
		}

		results = append(results, row)
	}

	return &results
}

func (pm *ProvidersModel) Get(id int) *Provider {
	var result Provider

	err := libs.DB.QueryRow("SELECT rowid, * WHERE rowid = ?", id).Scan(result.Id, result.Name, result.Phone)
	if err != nil {
		return nil
	}

	return &result
}

func (pm *ProvidersModel) Create(data NewProvider) {
	_, err := libs.DB.Exec("INSERT INTO providers (name, phone) VALUES (?, ?)", data.Name, data.Phone)
	if err != nil {
		panic(err)
	}
}

func (pm *ProvidersModel) Update(data Provider) {
	_, err := libs.DB.Exec(
		"UPDATE providers SET name = ?, phone = ? WHERE rowid = ?",
		data.Name, data.Phone, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm *ProvidersModel) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM providers WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
