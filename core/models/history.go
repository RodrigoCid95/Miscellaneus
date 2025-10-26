package models

type HistoryItem struct {
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

type HistoryModel interface {
	FindByID(id int) *SaleResult
	GetByRange(start int64, end int64) []HistoryItem
}
