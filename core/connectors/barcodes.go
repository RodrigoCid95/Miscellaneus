package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type BarCodesSQLiteConnector struct{}

func (bcm BarCodesSQLiteConnector) Create(data models.NewBarCode) {
	_, err := libs.DB.Exec(
		"INSERT INTO bar_codes (name, tag, value) VALUES (?, ?, ?)",
		data.Name, data.Tag, data.Value,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesSQLiteConnector) Update(data models.BarCode) {
	_, err := libs.DB.Exec(
		"UPDATE bar_codes SET name = ?, tag = ?, value = ? WHERE rowid = ?",
		data.Name, data.Tag, data.Value, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesSQLiteConnector) Get(id string) *models.BarCode {
	var result models.BarCode

	err := libs.DB.QueryRow(
		"SELECT rowid, * FROM bar_codes WHERE rowid = ?",
		id,
	).Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
	if err != nil {
		return nil
	}
	return &result
}

func (bcm BarCodesSQLiteConnector) GetAll() []models.BarCode {
	rows, err := libs.DB.Query("SELECT rowid, * FROM bar_codes")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	results := []models.BarCode{}

	for rows.Next() {
		var result models.BarCode
		err := rows.Scan(&result.Id, &result.Name, &result.Tag, &result.Value)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (bcm BarCodesSQLiteConnector) Delete(id string) {
	_, err := libs.DB.Exec("DELETE FROM bar_codes WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}

type barCodeDocument struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string             `json:"name" bson:"name"`
	Tag   string             `json:"tag" bson:"tag"`
	Value string             `json:"value" bson:"value"`
}

type newBarCodeDocument struct {
	Name  string `json:"name" bson:"name"`
	Tag   string `json:"tag" bson:"tag"`
	Value string `json:"value" bson:"value"`
}

type BarCodesMongoDBConnector struct {
	Collect *mongo.Collection
}

func (bcm BarCodesMongoDBConnector) Create(data models.NewBarCode) {
	newDocument := newBarCodeDocument{
		Name:  data.Name,
		Tag:   data.Tag,
		Value: data.Value,
	}
	_, err := bcm.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesMongoDBConnector) Update(data models.BarCode) {
	id, err := primitive.ObjectIDFromHex(data.Id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":  data.Name,
			"tag":   data.Tag,
			"value": data.Value,
		},
	}
	_, err = bcm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
}

func (bcm BarCodesMongoDBConnector) Get(id string) *models.BarCode {
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}
	filter := bson.M{"_id": objId}
	var document barCodeDocument
	err = bcm.Collect.FindOne(context.TODO(), filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil
		} else {
			panic(err)
		}
	}

	barcode := &models.BarCode{
		Id:    document.Id.Hex(),
		Name:  document.Name,
		Tag:   document.Tag,
		Value: document.Value,
	}
	return barcode
}

func (bcm BarCodesMongoDBConnector) GetAll() []models.BarCode {
	filter := bson.M{}
	cursor, err := bcm.Collect.Find(context.TODO(), filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []models.BarCode{}
		} else {
			panic(err)
		}
	}
	defer cursor.Close(context.TODO())

	var documents []barCodeDocument
	if err = cursor.All(context.TODO(), &documents); err != nil {
		panic(err)
	}

	var results []models.BarCode
	for _, document := range documents {
		results = append(results, models.BarCode{
			Id:    document.Id.Hex(),
			Name:  document.Name,
			Tag:   document.Tag,
			Value: document.Value,
		})
	}
	return results
}

func (bcm BarCodesMongoDBConnector) Delete(id string) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": objID}
	_, err = bcm.Collect.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
}
