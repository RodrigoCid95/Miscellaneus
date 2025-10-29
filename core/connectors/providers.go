package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProvidersSQLiteConnector struct{}

func (pm ProvidersSQLiteConnector) GetAll() []models.Provider {
	rows, err := libs.DB.Query("SELECT rowid, * FROM providers")
	if err != nil {
		return nil
	}

	results := []models.Provider{}

	for rows.Next() {
		var row models.Provider
		err := rows.Scan(&row.Id, &row.Name, &row.Phone)
		if err != nil {
			continue
		}

		results = append(results, row)
	}

	return results
}

func (pm ProvidersSQLiteConnector) Get(id string) *models.Provider {
	var result models.Provider

	err := libs.DB.QueryRow("SELECT rowid, * WHERE rowid = ?", id).Scan(result.Id, result.Name, result.Phone)
	if err != nil {
		return nil
	}

	return &result
}

func (pm ProvidersSQLiteConnector) Create(data models.NewProvider) {
	_, err := libs.DB.Exec("INSERT INTO providers (name, phone) VALUES (?, ?)", data.Name, data.Phone)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersSQLiteConnector) Update(data models.Provider) {
	_, err := libs.DB.Exec(
		"UPDATE providers SET name = ?, phone = ? WHERE rowid = ?",
		data.Name, data.Phone, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersSQLiteConnector) Delete(id string) {
	_, err := libs.DB.Exec("DELETE FROM providers WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}

type providerDocument struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string             `json:"name" bson:"name"`
	Phone string             `json:"phone" bson:"phone"`
}

type newProviderDocument struct {
	Name  string `json:"name" bson:"name"`
	Phone string `json:"phone" bson:"phone"`
}

type ProvidersMongoDBConnector struct {
	Collect *mongo.Collection
}

func (pm ProvidersMongoDBConnector) GetAll() []models.Provider {
	filter := bson.M{}
	cursor, err := pm.Collect.Find(context.TODO(), filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []models.Provider{}
		} else {
			panic(err)
		}
	}
	defer cursor.Close(context.TODO())

	var documents []providerDocument
	if err = cursor.All(context.TODO(), &documents); err != nil {
		panic(err)
	}

	var results []models.Provider
	for _, document := range documents {
		results = append(results, models.Provider{
			Id:    document.Id.Hex(),
			Name:  document.Name,
			Phone: document.Phone,
		})
	}
	return results
}

func (pm ProvidersMongoDBConnector) Get(id string) *models.Provider {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}

	filter := bson.M{"_id": objID}
	var document providerDocument
	err = pm.Collect.FindOne(context.TODO(), filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil
		} else {
			panic(err)
		}
	}

	provider := models.Provider{
		Id:    document.Id.Hex(),
		Name:  document.Name,
		Phone: document.Phone,
	}
	return &provider
}

func (pm ProvidersMongoDBConnector) Create(data models.NewProvider) {
	newDocument := newProviderDocument{
		Name:  data.Name,
		Phone: data.Phone,
	}

	_, err := pm.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersMongoDBConnector) Update(data models.Provider) {
	id, err := primitive.ObjectIDFromHex(data.Id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":  data.Name,
			"phone": data.Phone,
		},
	}
	_, err = pm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
}

func (pm ProvidersMongoDBConnector) Delete(id string) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": objID}
	_, err = pm.Collect.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
}
