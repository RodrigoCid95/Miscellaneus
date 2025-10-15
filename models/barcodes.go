package models

import (
	"Miscellaneous/libs"
	"fmt"
)

type BarCode struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Tag   string `json:"tag"`
	Value string `json:"value"`
}

type NewBarCode struct {
	Name  string `json:"name"`
	Tag   string `json:"tag"`
	Value string `json:"value"`
}

type BarCodesModel struct{}

func (bcm *BarCodesModel) Create(data NewBarCode) {
	_, err := libs.DB.Exec(
		"INSERT INTO bar_codes (name, tag, value) VALUES (?, ?, ?)",
		data.Name, data.Tag, data.Value,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm *BarCodesModel) Update(data BarCode) {
	_, err := libs.DB.Exec(
		"UPDATE bar_codes SET name = ?, tag = ?, value = ? WHERE rowid = ?",
		data.Name, data.Tag, data.Value, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm *BarCodesModel) Get(id int) *BarCode {
	var result BarCode

	err := libs.DB.QueryRow(
		"SELECT rowid, * FROM bar_codes WHERE rowid = ?",
		id,
	).Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
	if err != nil {
		return nil
	}
	return &result
}

func (bcm *BarCodesModel) GetAll() []BarCode {
	rows, err := libs.DB.Query("SELECT rowid, * FROM bar_codes")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	results := []BarCode{}

	for rows.Next() {
		var result BarCode
		err := rows.Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (bcm *BarCodesModel) Delete(id int) {
	_, err := libs.DB.Exec("DELETE FROM bar_codes WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}
