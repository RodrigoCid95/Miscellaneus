package servers

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type historyDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product primitive.ObjectID `json:"product" bson:"id_product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int32              `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type historyResultDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product ProductDocument    `json:"product" bson:"product"`
	User    userDocument       `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int32              `json:"count" bson:"count"`
	Total   float32            `json:"total" bson:"total"`
}

type HistoryServer struct {
	grpcs.UnimplementedHistoryServer
	Collect *mongo.Collection
}

func (hm HistoryServer) FindByID(ctx context.Context, in *grpcs.IdRequest) (*grpcs.SaleResult, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	var document historyDocument
	err = hm.Collect.FindOne(context.TODO(), filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		} else {
			return nil, err
		}
	}

	result := grpcs.SaleResult{
		Id:        document.Id.Hex(),
		IdProduct: document.Product.Hex(),
		IdUser:    document.User.Hex(),
		Date:      document.Date,
		Count:     document.Count,
		Total:     document.Total,
	}
	return &result, nil
}

func (hm HistoryServer) GetByRange(ctx context.Context, in *grpcs.GetByRangeArgs) (*grpcs.HistoryList, error) {
	results := []*grpcs.HistoryItem{}
	result := &grpcs.HistoryList{Items: results}

	pipeline := []bson.M{
		{
			"$match": bson.M{
				"date": bson.M{
					"$gte": in.GetStart(),
					"$lte": in.GetEnd(),
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
	cursor, err := hm.Collect.Aggregate(ctx, pipeline)
	if err != nil {
		return result, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var document historyResultDocument
		if err := cursor.Decode(&document); err != nil {
			continue
		}
		result.Items = append(result.Items, &grpcs.HistoryItem{
			Id:      document.Id.Hex(),
			Product: document.Product.Name,
			User:    document.User.FullName,
			Date:    document.Date,
			Count:   document.Count,
			Total:   document.Total,
		})
	}
	return result, nil
}
