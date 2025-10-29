package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CheckoutSQLiteConnector struct{}

func (cm CheckoutSQLiteConnector) CreateSale(sale models.NewSale, idUSer string, date int64) {
	_, err := libs.DB.Exec(
		"INSERT INTO sales (id_product, id_user, date, count, total) VALUES (?, ?, ?, ?, ?)",
		sale.Product, idUSer, date, sale.Count, sale.Total,
	)
	if err != nil {
		panic(err)
	}
}

func (cm CheckoutSQLiteConnector) GetHistory(id string) []models.Sale {
	rows, err := libs.DB.Query(
		"SELECT sales.ROWID as id, products.name as product, users.user_name as user, sales.date as date, sales.count as count, sales.total as total FROM sales INNER JOIN users ON users.ROWID = sales.id_user INNER JOIN products ON products.ROWID = sales.id_product INNER JOIN providers ON providers.ROWID = products.provider WHERE sales.id_user = ?",
		id,
	)
	if err != nil {
		panic(err)
	}

	results := []models.Sale{}

	for rows.Next() {
		result := models.Sale{}
		err := rows.Scan(&result.Id, &result.Product, &result.User, &result.Date, &result.Count, &result.Total)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (cm CheckoutSQLiteConnector) DeleteSale(id string) {
	_, err := libs.DB.Exec("DELETE FROM sales WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}

type saleDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product ProductDocument    `json:"product" bson:"product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int                `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type newSaleDocument struct {
	Product primitive.ObjectID `json:"product" bson:"id_product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int                `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type CheckoutMongoDBConnector struct {
	Collect *mongo.Collection
}

func (cm CheckoutMongoDBConnector) CreateSale(sale models.NewSale, idUSer string, date int64) {
	product, err := primitive.ObjectIDFromHex(sale.Product)
	if err != nil {
		return
	}
	user, err := primitive.ObjectIDFromHex(idUSer)
	if err != nil {
		return
	}

	newDocument := newSaleDocument{
		Product: product,
		User:    user,
		Date:    date,
		Count:   sale.Count,
		Total:   sale.Total,
	}
	_, err = cm.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		panic(err)
	}
}

func (cm CheckoutMongoDBConnector) GetHistory(id string) []models.Sale {
	pipeline := []bson.M{
		{
			"$lookup": bson.M{
				"from":         "products",
				"localField":   "product",
				"foreignField": "id_product",
				"as":           "product",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$product",
				"preserveNullAndEmptyArrays": false,
			},
		},
	}
	cursor, err := cm.Collect.Aggregate(context.TODO(), pipeline)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []models.Sale{}
		} else {
			panic(err)
		}
	}
	defer cursor.Close(context.TODO())

	var documents []saleDocument
	if err = cursor.All(context.TODO(), &documents); err != nil {
		panic(err)
	}

	var results []models.Sale
	for _, document := range documents {
		results = append(results, models.Sale{
			Id:      document.Id.Hex(),
			Product: document.Product.Name,
			User:    document.User.Hex(),
			Date:    document.Date,
			Count:   document.Count,
			Total:   document.Total,
		})
	}
	return results
}

func (cm CheckoutMongoDBConnector) DeleteSale(id string) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": objID}
	_, err = cm.Collect.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
}
