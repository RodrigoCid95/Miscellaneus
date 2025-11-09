package servers

import (
	"Miscellaneous/plugins/grpcs"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

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

type BarCodesServer struct {
	grpcs.UnimplementedBarCodesServer
	Collect *mongo.Collection
}

func (bcm BarCodesServer) Create(ctx context.Context, in *grpcs.NewBarCode) (*grpcs.Empty, error) {
	newDocument := newBarCodeDocument{
		Name:  in.GetName(),
		Tag:   in.GetTag(),
		Value: in.GetValue(),
	}
	_, err := bcm.Collect.InsertOne(ctx, newDocument)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (bcm BarCodesServer) Update(ctx context.Context, in *grpcs.BarCode) (*grpcs.Empty, error) {
	id, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"name":  in.GetName(),
			"tag":   in.GetTag(),
			"value": in.GetValue(),
		},
	}
	_, err = bcm.Collect.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (bcm BarCodesServer) Get(ctx context.Context, in *grpcs.IdRequest) (*grpcs.BarCode, error) {
	objId, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objId}
	var document barCodeDocument
	err = bcm.Collect.FindOne(ctx, filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		} else {
			return nil, err
		}
	}

	barcode := &grpcs.BarCode{
		Id:    document.Id.Hex(),
		Name:  document.Name,
		Tag:   document.Tag,
		Value: document.Value,
	}
	return barcode, nil
}

func (bcm BarCodesServer) GetAll(ctx context.Context, _ *grpcs.Empty) (*grpcs.BarCodeList, error) {
	results := []*grpcs.BarCode{}
	result := &grpcs.BarCodeList{Barcodes: results}

	filter := bson.M{}
	cursor, err := bcm.Collect.Find(ctx, filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, nil
		} else {
			return result, err
		}
	}
	defer cursor.Close(ctx)

	var documents []barCodeDocument
	if err = cursor.All(ctx, &documents); err != nil {
		return result, err
	}

	for _, document := range documents {
		result.Barcodes = append(result.Barcodes, &grpcs.BarCode{
			Id:    document.Id.Hex(),
			Name:  document.Name,
			Tag:   document.Tag,
			Value: document.Value,
		})
	}
	return result, nil
}

func (bcm BarCodesServer) Delete(ctx context.Context, in *grpcs.IdRequest) (*grpcs.Empty, error) {
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	_, err = bcm.Collect.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}
