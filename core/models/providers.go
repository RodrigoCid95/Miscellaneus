package models

type Provider struct {
	Id    string `json:"id" bson:"_id"`
	Name  string `json:"name" bson:"name"`
	Phone string `json:"phone" bson:"phone"`
}

type NewProvider struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

type ProvidersModel interface {
	GetAll() []Provider
	Get(id string) *Provider
	Create(data NewProvider)
	Update(data Provider)
	Delete(id string)
}
