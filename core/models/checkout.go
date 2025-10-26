package models

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

type CheckoutModel interface {
	CreateSale(sale NewSale, idUSer int, date int64)
	GetHistory(id int) []Sale
	DeleteSale(id int)
}
