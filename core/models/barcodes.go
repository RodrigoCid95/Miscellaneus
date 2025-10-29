package models

type BarCode struct {
	Id    string `json:"id"`
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
	Get(id string) *BarCode
	GetAll() []BarCode
	Delete(id string)
}
