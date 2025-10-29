package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type HistorySQLiteConnector struct{}

func (hm HistorySQLiteConnector) FindByID(id string) *models.SaleResult {
	result := models.SaleResult{}

	err := libs.DB.QueryRow(
		"SELECT rowid, * FROM sales WHERE rowid = ?",
		id,
	).Scan(
		&result.Id,
		&result.IdProduct,
		&result.IdUser,
		&result.Date,
		&result.Count,
		&result.Total,
	)
	if err != nil {
		return nil
	}

	return &result
}

func (hm HistorySQLiteConnector) GetByRange(start int64, end int64) []models.HistoryItem {
	results := []models.HistoryItem{}

	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product WHERE sales.date > ? AND sales.date < ?",
		start, end,
	)
	if err != nil {
		panic(err)
	}

	for rows.Next() {
		result := models.HistoryItem{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

type historyDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product primitive.ObjectID `json:"product" bson:"id_product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int                `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type historyResultDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product ProductDocument    `json:"product" bson:"product"`
	User    userDocument       `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int                `json:"count" bson:"count"`
	Total   float32            `json:"total" bson:"total"`
}

type HistoryMongoDBConnector struct {
	Collect *mongo.Collection
}

func (hm HistoryMongoDBConnector) FindByID(id string) *models.SaleResult {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}
	filter := bson.M{"_id": objID}
	var document historyDocument
	err = hm.Collect.FindOne(context.TODO(), filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil
		} else {
			panic(err)
		}
	}

	result := models.SaleResult{
		Id:        document.Id.Hex(),
		IdProduct: document.Product.Hex(),
		IdUser:    document.User.Hex(),
		Date:      document.Date,
		Count:     document.Count,
		Total:     document.Total,
	}
	return &result
}

func (hm HistoryMongoDBConnector) GetByRange(start int64, end int64) []models.HistoryItem {
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"date": bson.M{
					"$gte": start,
					"$lte": end,
				},
			},
		},
		{
			"$lookup": bson.M{
				"from":         "products",
				"localField":   "id_product",
				"foreignField": "_id",
				"as":           "product",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$product",
				"preserveNullAndEmptyArrays": false,
			},
		},
		{
			"$lookup": bson.M{
				"from":         "users",
				"localField":   "user",
				"foreignField": "_id",
				"as":           "user",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$user",
				"preserveNullAndEmptyArrays": false,
			},
		},
	}
	cursor, err := hm.Collect.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil
	}
	defer cursor.Close(context.TODO())

	var results []models.HistoryItem
	for cursor.Next(context.TODO()) {
		var document historyResultDocument
		if err := cursor.Decode(&document); err != nil {
			continue
		}
		results = append(results, models.HistoryItem{
			Id:      document.Id.Hex(),
			Product: document.Product.Name,
			User:    document.User.FullName,
			Date:    document.Date,
			Count:   document.Count,
			Total:   document.Total,
		})
	}
	return results
}
