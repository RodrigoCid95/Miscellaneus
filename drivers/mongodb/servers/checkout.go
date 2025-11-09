package servers

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type saleDocument struct {
	Id      primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Product ProductDocument    `json:"product" bson:"product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int32              `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type newSaleDocument struct {
	Product primitive.ObjectID `json:"product" bson:"id_product"`
	User    primitive.ObjectID `json:"user" bson:"user"`
	Date    int64              `json:"date" bson:"date"`
	Count   int                `json:"count" bson:"count"`
	Total   float64            `json:"total" bson:"total"`
}

type CheckoutServer struct {
	grpcs.UnimplementedCheckoutServer
	Collect *mongo.Collection
}

func (cm CheckoutServer) CreateSale(ctx context.Context, in *grpcs.CreateSaleArgs) (*grpcs.Empty, error) {
	product, err := primitive.ObjectIDFromHex(in.GetSale().GetProduct())
	if err != nil {
		return nil, err
	}
	user, err := primitive.ObjectIDFromHex(in.GetSale().GetProduct())
	if err != nil {
		return nil, err
	}

	newDocument := newSaleDocument{
		Product: product,
		User:    user,
		Date:    in.GetDate(),
		Count:   int(in.GetSale().GetCount()),
		Total:   in.GetSale().GetTotal(),
	}
	_, err = cm.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (cm CheckoutServer) GetHistory(ctx context.Context, in *grpcs.IdRequest) (*grpcs.SalesList, error) {
	results := []*grpcs.Sale{}
	result := &grpcs.SalesList{Sales: results}

	id, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return result, err
	}
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"user": id,
			},
		},
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
			return result, nil
		} else {
			return result, err
		}
	}
	defer cursor.Close(context.TODO())

	var documents []saleDocument
	if err = cursor.All(context.TODO(), &documents); err != nil {
		return nil, err
	}

	for _, document := range documents {
		result.Sales = append(result.Sales, &grpcs.Sale{
			Id:      document.Id.Hex(),
			Product: document.Product.Name,
			User:    document.User.Hex(),
			Date:    document.Date,
			Count:   document.Count,
			Total:   document.Total,
		})
	}
	return result, nil
}

func (cm CheckoutServer) DeleteSale(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	_, err = cm.Collect.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}
