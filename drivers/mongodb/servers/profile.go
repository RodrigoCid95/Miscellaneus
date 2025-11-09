package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/crypto"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProfileServer struct {
	grpcs.UnimplementedProfileServer
	Collect *mongo.Collection
}

func (pm ProfileServer) UpdateProfile(ctx context.Context, in *grpcs.UpdateProfileArgs) (*grpcs.Empty, error) {
	id, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, nil
	}

	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"user_name": in.GetData().GetUserName(),
			"full_name": in.GetData().GetFullName(),
		},
	}
	_, err = pm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}

func (pm ProfileServer) UpdatePassword(ctx context.Context, in *grpcs.UpdatePasswordArgs) (*grpcs.Empty, error) {
	hash := crypto.GenerateHash(in.GetPassword())
	objID, err := primitive.ObjectIDFromHex(in.GetId())
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objID}
	update := bson.M{
		"$set": bson.M{
			"hash": hash,
		},
	}
	_, err = pm.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}

	return &grpcs.Empty{}, nil
}
