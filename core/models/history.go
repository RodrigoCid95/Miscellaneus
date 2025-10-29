package models

type HistoryItem struct {
	Id      string  `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int     `json:"count"`
	Total   float32 `json:"total"`
}

type SaleResult struct {
	Id        string  `json:"id"`
	IdProduct string  `json:"idProduct"`
	IdUser    string  `json:"idUser"`
	Date      int64   `json:"date"`
	Count     int     `json:"count"`
	Total     float64 `json:"total"`
}

type HistoryModel interface {
	FindByID(id string) *SaleResult
	GetByRange(start int64, end int64) []HistoryItem
}
