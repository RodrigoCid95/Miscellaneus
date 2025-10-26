package models

type NewProduct struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Sku         string `json:"sku"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
	MinStock    int    `json:"minStock"`
	IdProvider  int    `json:"idProvider"`
}

type Product struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Sku         string   `json:"sku"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	MinStock    int      `json:"minStock"`
	Provider    Provider `json:"provider"`
}

type ProductGroup struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Sku         string   `json:"sku"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	MinStock    int      `json:"minStock"`
	Provider    Provider `json:"provider"`
	Count       int      `json:"count"`
}

type DataProduct struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Sku         string `json:"sku"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
	MinStock    int    `json:"minStock"`
	IdProvider  int    `json:"idProvider"`
}

type ProductsModel interface {
	GetAll() []Product
	Get(id int) *Product
	Find(query string) []Product
	Create(data NewProduct)
	Update(data DataProduct)
	Delete(id int)
}
