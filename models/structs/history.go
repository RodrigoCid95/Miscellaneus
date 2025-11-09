package structs

type DataDay struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Day   int `json:"day"`
}

type DataWeek struct {
	Year int `json:"year"`
	Week int `json:"week"`
}

type DataMonth struct {
	Year  int `json:"year"`
	Month int `json:"month"`
}

type HistoryItem struct {
	Id      string  `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int32   `json:"count"`
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
