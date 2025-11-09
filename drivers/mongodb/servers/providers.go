package servers

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type providerDocument struct {
	Id    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name  string             `json:"name" bson:"name"`
	Phone string             `json:"phone" bson:"phone"`
}

type newProviderDocument struct {
	Name  string `json:"name" bson:"name"`
	Phone string `json:"phone" bson:"phone"`
}

type ProvidersServer struct {
	grpcs.UnimplementedProvidersServer
	Collect *mongo.Collection
}

func (pm ProvidersServer) GetAll(ctx context.Context, in *grpcs.Empty) (*grpcs.ProviderList, error) {
	results := []*grpcs.Provider{}
	result := &grpcs.ProviderList{Providers: results}

	filter := bson.M{}
	cursor, err := pm.Collect.Find(ctx, filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, nil
		} else {
			return result, err
		}
	}
	defer cursor.Close(ctx)

	var documents []providerDocument
	if err = cursor.All(ctx, &documents); err != nil {
		return result, err
	}

	for _, document := range documents {
		result.Providers = append(result.Providers, &grpcs.Provider{
			Id:    document.Id.Hex(),
			Name:  document.Name,
			Phone: document.Phone,
		})
	}

	return result, nil
}

func (pm ProvidersServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Provider, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objID}
	var document providerDocument
	err = pm.Collect.FindOne(ctx, filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		} else {
			panic(err)
		}
	}

	provider := grpcs.Provider{
		Id:    document.Id.Hex(),
		Name:  document.Name,
		Phone: document.Phone,
	}
	return &provider, nil
}

func (pm ProvidersServer) Create(ctx context.Context, in *grpcs.NewProvider) (*grpcs.Empty, error) {
	newDocument := newProviderDocument{
		Name:  in.GetName(),
		Phone: in.GetPhone(),
	}

	_, err := pm.Collect.InsertOne(ctx, newDocument)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProvidersServer) Update(ctx context.Context, in *grpcs.Provider) (*grpcs.Empty, error) {
	id, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":  in.GetName(),
			"phone": in.GetPhone(),
		},
	}
	_, err = pm.Collect.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProvidersServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
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
