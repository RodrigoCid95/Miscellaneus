package servers

import (
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/crypto"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type userDocument struct {
	Id       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserName string             `json:"userName" bson:"user_name"`
	FullName string             `json:"fullName" bson:"full_name"`
	IsAdmin  bool               `json:"isAdmin" bson:"is_admin"`
	Hash     string             `json:"hash" bson:"hash"`
}

type newUserDocument struct {
	UserName string `json:"userName" bson:"user_name"`
	FullName string `json:"fullName" bson:"full_name"`
	IsAdmin  bool   `json:"isAdmin" bson:"is_admin"`
	Hash     string `json:"hash" bson:"hash"`
}

type UsersServer struct {
	grpcs.UnimplementedUsersServer
	Collect *mongo.Collection
}

func (um UsersServer) Create(ctx context.Context, newUser *grpcs.NewUser) (*grpcs.Empty, error) {
	hash := crypto.GenerateHash(newUser.Password)
	newDocument := newUserDocument{
		UserName: newUser.UserName,
		FullName: newUser.FullName,
		IsAdmin:  newUser.IsAdmin,
		Hash:     hash,
	}
	_, err := um.Collect.InsertOne(ctx, newDocument)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (um UsersServer) Get(ctx context.Context, in *grpcs.UserNameRequest) (*grpcs.GetUserResult, error) {
	var result grpcs.GetUserResult
	filter := bson.M{"user_name": in.GetUserName()}
	var document userDocument
	err := um.Collect.FindOne(ctx, filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return &result, nil
		} else {
			return &result, err
		}
	}

	result.User = &grpcs.UserResult{
		Id:       document.Id.Hex(),
		UserName: document.UserName,
		FullName: document.FullName,
		IsAdmin:  document.IsAdmin,
		Hash:     document.Hash,
	}
	return &result, nil
}

func (um UsersServer) GetAll(ctx context.Context, empty *grpcs.Empty) (*grpcs.UserList, error) {
	results := []*grpcs.User{}
	result := &grpcs.UserList{Users: results}

	filter := bson.M{}
	cursor, err := um.Collect.Find(ctx, filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, nil
		} else {
			return result, err
		}
	}
	defer cursor.Close(ctx)

	var documents []userDocument
	if err = cursor.All(ctx, &documents); err != nil {
		return result, err
	}

	for _, document := range documents {
		result.Users = append(result.Users, &grpcs.User{
			Id:       document.Id.Hex(),
			UserName: document.UserName,
			FullName: document.FullName,
			IsAdmin:  document.IsAdmin,
		})
	}
	return result, nil
}

func (um UsersServer) Update(ctx context.Context, user *grpcs.User) (*grpcs.Empty, error) {
	id, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"user_name": user.UserName,
			"full_name": user.FullName,
			"is_admin":  user.IsAdmin,
		},
	}
	_, err = um.Collect.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}

func (um UsersServer) Delete(ctx context.Context, id *grpcs.IdRequest) (*grpcs.Empty, error) {
	objID, err := primitive.ObjectIDFromHex(id.Id)
	if err != nil {
		return nil, err
	}
	filter := bson.M{"_id": objID}
	_, err = um.Collect.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}
	return &grpcs.Empty{}, nil
}
