package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProfileSQLiteConnector struct{}

func (pm ProfileSQLiteConnector) UpdateProfile(data models.ProfileData, id string) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ? WHERE rowid = ?",
		data.UserName, data.FullName, id,
	)

	if err != nil {
		panic(err)
	}
}

func (pm ProfileSQLiteConnector) UpdatePassword(password string, id string) {
	hash := utils.GenerateHash(password)

	_, err := libs.DB.Exec(
		"UPDATE users SET hash = ? WHERE rowid = ?",
		hash, id,
	)

	if err != nil {
		panic(err)
	}
}

type ProfileMongoDBConnector struct {
	Collect *mongo.Collection
}

func (pm ProfileMongoDBConnector) UpdateProfile(data models.ProfileData, id string) {
	filter := bson.D{{Key: "_id", Value: id}}
	replacement := bson.D{
		{Key: "user_name", Value: data.UserName},
		{Key: "full_name", Value: data.FullName},
	}
	_, err := pm.Collect.ReplaceOne(context.TODO(), filter, replacement)
	if err != nil {
		panic(err)
	}
}

func (pm ProfileMongoDBConnector) UpdatePassword(password string, id string) {
	hash := utils.GenerateHash(password)
	filter := bson.D{{Key: "_id", Value: id}}
	replacement := bson.D{{Key: "hash", Value: hash}}
	_, err := pm.Collect.ReplaceOne(context.TODO(), filter, replacement)
	if err != nil {
		panic(err)
	}
}
