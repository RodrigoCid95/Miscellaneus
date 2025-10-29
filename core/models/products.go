package models

type NewProduct struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Sku         string  `json:"sku"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	MinStock    int     `json:"minStock"`
	IdProvider  string  `json:"idProvider"`
}

type Product struct {
	Id          string   `json:"id" bson:"_id"`
	Name        string   `json:"name" bson:"name"`
	Description string   `json:"description" bson:"description"`
	Sku         string   `json:"sku" bson:"sku"`
	Price       float64  `json:"price" bson:"price"`
	Stock       int      `json:"stock" bson:"stock"`
	MinStock    int      `json:"minStock" bson:"min_stock"`
	Provider    Provider `json:"provider" bson:"provider"`
}

type ProductGroup struct {
	Id          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Sku         string  `json:"sku"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	MinStock    int     `json:"minStock"`
	Count       int     `json:"count"`
}

type DataProduct struct {
	Id          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Sku         string  `json:"sku"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	MinStock    int     `json:"minStock"`
	IdProvider  string  `json:"idProvider"`
}

type ProductsModel interface {
	GetAll() []Product
	Get(id string) *Product
	Find(query string) []Product
	Create(data NewProduct)
	Update(data DataProduct)
	Delete(id string)
	UpdateStock(id string, stock int)
}
