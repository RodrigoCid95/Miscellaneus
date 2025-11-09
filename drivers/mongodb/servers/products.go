package servers

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProductDocument struct {
	Id          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Sku         string             `json:"sku" bson:"sku"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int                `json:"stock" bson:"stock"`
	MinStock    int                `json:"minStock" bson:"min_stock"`
	Provider    providerDocument   `json:"provider" bson:"provider"`
}

type newProductDocument struct {
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Sku         string             `json:"sku" bson:"sku"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int32              `json:"stock" bson:"stock"`
	MinStock    int32              `json:"minStock" bson:"min_stock"`
	Provider    primitive.ObjectID `json:"provider" bson:"provider"`
}

type ProductsServer struct {
	grpcs.UnimplementedProductsServer
	Collect *mongo.Collection
}

func (pm ProductsServer) GetAll(ctx context.Context, _ *grpcs.Empty) (*grpcs.ProductList, error) {
	results := []*grpcs.Product{}
	result := &grpcs.ProductList{Products: results}

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

	cursor, err := pm.Collect.Aggregate(ctx, pipeline)
	if err != nil {
		return result, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var document ProductDocument
		if err := cursor.Decode(&document); err != nil {
			continue
		}
		result.Products = append(result.Products, &grpcs.Product{
			Id:          document.Id.Hex(),
			Name:        document.Name,
			Description: document.Description,
			Sku:         document.Sku,
			Price:       document.Price,
			Stock:       int32(document.Stock),
			MinStock:    int32(document.MinStock),
			Provider: &grpcs.Provider{
				Id:    document.Provider.Id.Hex(),
				Name:  document.Provider.Name,
				Phone: document.Provider.Phone,
			},
		})
	}

	return result, nil
}

func (pm ProductsServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Product, error) {
	objectID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
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

	cursor, err := pm.Collect.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var result ProductDocument
	if cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return nil, nil
		}
		return &grpcs.Product{
			Id:          result.Id.Hex(),
			Name:        result.Name,
			Description: result.Description,
			Sku:         result.Sku,
			Price:       result.Price,
			Stock:       int32(result.Stock),
			MinStock:    int32(result.MinStock),
			Provider: &grpcs.Provider{
				Id:    result.Provider.Id.Hex(),
				Name:  result.Provider.Name,
				Phone: result.Provider.Phone,
			},
		}, nil
	}

	return nil, nil
}

func (pm ProductsServer) Find(ctx context.Context, in *grpcs.QueryRequest) (*grpcs.ProductList, error) {
	results := []*grpcs.Product{}
	result := &grpcs.ProductList{Products: results}

	pipeline := []bson.M{}
	query := in.GetQuery()
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

	cursor, err := pm.Collect.Aggregate(ctx, pipeline)
	if err != nil {
		return result, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var document ProductDocument
		if err := cursor.Decode(&document); err != nil {
			continue
		}
		result.Products = append(result.Products, &grpcs.Product{
			Id:          document.Id.Hex(),
			Name:        document.Name,
			Description: document.Description,
			Sku:         document.Sku,
			Price:       document.Price,
			Stock:       int32(document.Stock),
			MinStock:    int32(document.MinStock),
			Provider: &grpcs.Provider{
				Id:    document.Provider.Id.Hex(),
				Name:  document.Provider.Name,
				Phone: document.Provider.Phone,
			},
		})
	}

	return result, nil
}

func (pm ProductsServer) Create(ctx context.Context, in *grpcs.NewProduct) (*grpcs.Empty, error) {
	IdProvider, err := primitive.ObjectIDFromHex(in.GetIdProvider())
	if err != nil {
		return nil, err
	}
	newDocument := newProductDocument{
		Name:        in.GetName(),
		Description: in.GetDescription(),
		Sku:         in.GetSku(),
		Price:       in.GetPrice(),
		Stock:       in.GetStock(),
		MinStock:    in.GetMinStock(),
		Provider:    IdProvider,
	}

	_, err = pm.Collect.InsertOne(ctx, newDocument)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) Update(ctx context.Context, in *grpcs.DataProduct) (*grpcs.Empty, error) {
	id, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}

	idProvider, err := primitive.ObjectIDFromHex(in.GetIdProvider())
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":        in.GetName(),
			"description": in.GetDescription(),
			"sku":         in.GetSku(),
			"price":       in.GetPrice(),
			"stock":       in.GetStock(),
			"min_stock":   in.GetMinStock(),
			"provider":    idProvider,
		},
	}
	_, err = pm.Collect.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	_, err = pm.Collect.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProductsServer) UpdateStock(ctx context.Context, in *grpcs.UpdateStockArgs) (*grpcs.Empty, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	update := bson.M{"$inc": bson.M{"stock": in.GetStock()}}
	_, err = pm.Collect.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}
