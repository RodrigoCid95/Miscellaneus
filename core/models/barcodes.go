package models

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

type BarCodesModel interface {
	Create(data NewBarCode)
	Update(data BarCode)
	Get(id int) *BarCode
	GetAll() []BarCode
	Delete(id int)
}
