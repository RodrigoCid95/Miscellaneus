package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductsSQLiteConnector struct{}

func (pm ProductsSQLiteConnector) GetAll() []models.Product {
	rows, err := libs.DB.Query("SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID")
	if err != nil {
		panic(err)
	}

	results := []models.Product{}

	for rows.Next() {
		result := models.Product{}
		err = rows.Scan(
			&result.Id,
			&result.Name,
			&result.Description,
			&result.Sku,
			&result.Price,
			&result.Stock,
			&result.MinStock,
			&result.Provider.Id,
			&result.Provider.Name,
			&result.Provider.Phone,
		)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (pm ProductsSQLiteConnector) Get(id string) *models.Product {
	var result models.Product

	err := libs.DB.QueryRow(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.ROWID = ?",
		id,
	).Scan(
		&result.Id,
		&result.Name,
		&result.Description,
		&result.Sku,
		&result.Price,
		&result.Stock,
		&result.MinStock,
		&result.Provider.Id,
		&result.Provider.Name,
		&result.Provider.Phone,
	)
	if err != nil {
		return nil
	}

	return &result
}

func (pm ProductsSQLiteConnector) Find(query string) []models.Product {
	query = "%" + query + "%"
	rows, err := libs.DB.Query(
		"SELECT products.ROWID, products.name, products.description, products.sku, products.price, products.stock, products.min_stock, providers.ROWID, providers.name, providers.phone FROM products INNER JOIN providers ON products.provider = providers.ROWID WHERE products.name LIKE ? OR products.sku LIKE ?",
		query, query,
	)
	if err != nil {
		panic(err)
	}

	results := []models.Product{}

	for rows.Next() {
		result := models.Product{}
		err = rows.Scan(
			&result.Id,
			&result.Name,
			&result.Description,
			&result.Sku,
			&result.Price,
			&result.Stock,
			&result.MinStock,
			&result.Provider.Id,
			&result.Provider.Name,
			&result.Provider.Phone,
		)
		if err != nil {
			continue
		}

		results = append(results, result)
	}

	return results
}

func (pm ProductsSQLiteConnector) Create(data models.NewProduct) {
	_, err := libs.DB.Exec(
		"INSERT INTO products (name, description, sku, price, stock, min_stock, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
		&data.Name, &data.Description, &data.Sku, &data.Price, &data.Stock, &data.MinStock, &data.IdProvider,
	)

	if err != nil {
		panic(err)
	}
}

func (pm ProductsSQLiteConnector) Update(data models.DataProduct) {
	_, err := libs.DB.Exec(
		"UPDATE products SET name = ?, description = ?, sku = ?, price = ?, stock = ?, min_stock = ?, provider = ? WHERE rowid = ?",
		data.Name, data.Description, data.Sku, data.Price, data.Stock, data.MinStock, data.IdProvider, data.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (pm ProductsSQLiteConnector) Delete(id string) {
	_, err := libs.DB.Exec("DELETE FROM products WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}

func (pm ProductsSQLiteConnector) UpdateStock(id string, stock int) {
	_, err := libs.DB.Exec(
		"UPDATE products SET stock = stock - ? WHERE rowid = ?",
		stock, id,
	)
	if err != nil {
		panic(err)
	}
}

type ProductDocument struct {
	Id          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Sku         string             `json:"sku" bson:"sku"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int                `json:"stock" bson:"stock"`
	MinStock    int                `json:"minStock" bson:"min_stock"`
	Provider    primitive.ObjectID `json:"provider" bson:"provider"`
}

type newProductDocument struct {
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Sku         string             `json:"sku" bson:"sku"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int                `json:"stock" bson:"stock"`
	MinStock    int                `json:"minStock" bson:"min_stock"`
	Provider    primitive.ObjectID `json:"provider" bson:"provider"`
}

type ProductsMongoDBConnector struct {
	Collect *mongo.Collection
}

func (pm ProductsMongoDBConnector) GetAll() []models.Product {
	pipeline := []bson.M{
		{
			"$lookup": bson.M{
				"from":         "providers",
				"localField":   "provider",
				"foreignField": "_id",
				"as":           "provider",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$provider",
				"preserveNullAndEmptyArrays": false,
			},
		},
	}

	cursor, err := pm.Collect.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return []models.Product{}
	}
	defer cursor.Close(context.TODO())

	var results []models.Product

	for cursor.Next(context.TODO()) {
		var result models.Product
		if err := cursor.Decode(&result); err != nil {
			continue
		}
		results = append(results, result)
	}
	return results
}

func (pm ProductsMongoDBConnector) Get(id string) *models.Product {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil
	}

	pipeline := []bson.M{
		{
			"$match": bson.M{
				"_id": objectID,
			},
		},
		{
			"$lookup": bson.M{
				"from":         "providers",
				"localField":   "provider",
				"foreignField": "_id",
				"as":           "provider",
			},
		},
		{
			"$unwind": bson.M{
				"path":                       "$provider",
				"preserveNullAndEmptyArrays": false,
			},
		},
	}

	cursor, err := pm.Collect.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil
	}
	defer cursor.Close(context.TODO())

	var result models.Product
	if cursor.Next(context.TODO()) {
		if err := cursor.Decode(&result); err != nil {
			return nil
		}
		return &result
	}

	return nil
}

func (pm ProductsMongoDBConnector) Find(query string) []models.Product {
	pipeline := []bson.M{}

	if query != "" {
		pipeline = append(pipeline, bson.M{
			"$match": bson.M{
				"$or": []bson.M{
					{"name": bson.M{"$regex": query, "$options": "i"}},
					{"sku": bson.M{"$regex": query, "$options": "i"}},
				},
			},
		})
	}

	pipeline = append(pipeline,
		bson.M{
			"$lookup": bson.M{
				"from":         "providers",
				"localField":   "provider",
				"foreignField": "_id",
				"as":           "provider",
			},
		},
		bson.M{
			"$unwind": bson.M{
				"path":                       "$provider",
				"preserveNullAndEmptyArrays": false,
			},
		},
	)

	cursor, err := pm.Collect.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return []models.Product{}
	}
	defer cursor.Close(context.TODO())

	var results []models.Product
	for cursor.Next(context.TODO()) {
		var result models.Product
		if err := cursor.Decode(&result); err != nil {
			continue
		}
		results = append(results, result)
	}
	return results
}

func (pm ProductsMongoDBConnector) Create(data models.NewProduct) {
	IdProvider, err := primitive.ObjectIDFromHex(data.IdProvider)
	if err != nil {
		return
	}
	newDocument := newProductDocument{
		Name:        data.Name,
		Description: data.Description,
		Sku:         data.Sku,
		Price:       data.Price,
		Stock:       data.Stock,
		MinStock:    data.MinStock,
		Provider:    IdProvider,
	}

	_, err = pm.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		panic(err)
	}
}

func (pm ProductsMongoDBConnector) Update(data models.DataProduct) {
	id, err := primitive.ObjectIDFromHex(data.Id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":        data.Name,
			"description": data.Description,
			"sku":         data.Sku,
			"price":       data.Price,
			"stock":       data.Stock,
			"min_stock":   data.MinStock,
			"provider":    data.IdProvider,
		},
	}
	_, err = pm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
}

func (pm ProductsMongoDBConnector) Delete(id string) {
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

func (pm ProductsMongoDBConnector) UpdateStock(id string, stock int) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": objID}
	update := bson.M{"$inc": bson.M{"stock": stock}}
	_, err = pm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
}
