package models

type CheckoutItem struct {
	Id    string `json:"id"`
	Count int    `json:"count"`
}

type Sale struct {
	Id      string  `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int     `json:"count"`
	Total   float64 `json:"total"`
}

type NewSale struct {
	Product string  `json:"product"`
	Count   int     `json:"count"`
	Total   float64 `json:"total"`
}

type CheckoutModel interface {
	CreateSale(sale NewSale, idUSer string, date int64)
	GetHistory(id string) []Sale
	DeleteSale(id string)
}
