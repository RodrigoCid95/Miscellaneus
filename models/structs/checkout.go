package structs

type CheckoutItem struct {
	Id    string `json:"id"`
	Count int32  `json:"count"`
}

type Sale struct {
	Id      string  `json:"id"`
	Product string  `json:"product"`
	User    string  `json:"user"`
	Date    int64   `json:"date"`
	Count   int32   `json:"count"`
	Total   float64 `json:"total"`
}

type NewSale struct {
	Product string  `json:"product"`
	Date    int64   `json:"date"`
	Count   int32   `json:"count"`
	Total   float64 `json:"total"`
}
