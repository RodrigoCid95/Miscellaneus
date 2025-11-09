package structs

type Provider struct {
	Id    string `json:"id" bson:"_id"`
	Name  string `json:"name" bson:"name"`
	Phone string `json:"phone" bson:"phone"`
}

type NewProvider struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}
