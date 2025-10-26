package models

type Provider struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type NewProvider struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type ProvidersModel interface {
	GetAll() *[]Provider
	Get(id int) *Provider
	Create(data NewProvider)
	Update(data Provider)
	Delete(id int)
}
