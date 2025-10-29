package connectors

import (
	"Miscellaneous/core/libs"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UsersSQLiteConnector struct{}

func (um UsersSQLiteConnector) Create(newUser models.NewUser) {
	hash := utils.GenerateHash(newUser.Password)

	_, err := libs.DB.Exec(
		"INSERT INTO users (user_name, full_name, hash, is_admin) VALUES (?, ?, ?, ?)",
		newUser.UserName,
		newUser.FullName,
		hash,
		newUser.IsAdmin,
	)

	if err != nil {
		panic(err)
	}
}

func (um UsersSQLiteConnector) Get(userName string) *models.UserResult {
	var result models.UserResult

	err := libs.DB.QueryRow(
		"SELECT rowid, user_name, full_name, hash, is_admin FROM users WHERE user_name = ?",
		userName,
	).Scan(
		&result.Id,
		&result.UserName,
		&result.FullName,
		&result.Hash,
		&result.IsAdmin,
	)
	if err != nil {
		return nil
	}
	return &result
}

func (um UsersSQLiteConnector) GetAll() []models.User {
	rows, err := libs.DB.Query("SELECT rowid, user_name, full_name, hash, is_admin FROM users")
	if err != nil {
		return nil
	}

	var results []models.User

	for rows.Next() {
		var result models.UserResult
		err := rows.Scan(&result.Id, &result.UserName, &result.FullName, &result.Hash, &result.IsAdmin)
		if err != nil {
			continue
		}

		user := models.User{
			Id:       result.Id,
			UserName: result.UserName,
			FullName: result.FullName,
			IsAdmin:  result.IsAdmin,
		}
		results = append(results, user)
	}

	return results
}

func (um UsersSQLiteConnector) Update(user models.User) {
	_, err := libs.DB.Exec(
		"UPDATE users SET user_name = ?, full_name = ?, is_admin = ? WHERE rowid = ?",
		user.UserName, user.FullName, user.IsAdmin, user.Id,
	)
	if err != nil {
		panic(err)
	}
}

func (um UsersSQLiteConnector) Delete(id string) {
	_, err := libs.DB.Exec("DELETE FROM users WHERE rowid = ?", id)
	if err != nil {
		panic(err)
	}
}

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

type UsersMongoDBConnector struct {
	Collect *mongo.Collection
}

func (um UsersMongoDBConnector) Create(newUser models.NewUser) {
	hash := utils.GenerateHash(newUser.Password)
	newDocument := newUserDocument{
		UserName: newUser.UserName,
		FullName: newUser.FullName,
		IsAdmin:  newUser.IsAdmin,
		Hash:     hash,
	}
	_, err := um.Collect.InsertOne(context.TODO(), newDocument)
	if err != nil {
		panic(err)
	}
}

func (um UsersMongoDBConnector) Get(userName string) *models.UserResult {
	filter := bson.D{{Key: "user_name", Value: userName}}
	var document userDocument
	err := um.Collect.FindOne(context.TODO(), filter).Decode(&document)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil
		} else {
			panic(err)
		}
	}

	user := &models.UserResult{
		Id:       document.Id.Hex(),
		UserName: document.UserName,
		FullName: document.FullName,
		IsAdmin:  document.IsAdmin,
		Hash:     document.Hash,
	}
	return user
}

func (um UsersMongoDBConnector) GetAll() []models.User {
	filter := bson.M{}
	cursor, err := um.Collect.Find(context.TODO(), filter)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return []models.User{}
		} else {
			panic(err)
		}
	}
	defer cursor.Close(context.TODO())

	var documents []userDocument
	if err = cursor.All(context.TODO(), &documents); err != nil {
		panic(err)
	}

	var results []models.User
	for _, document := range documents {
		results = append(results, models.User{
			Id:       document.Id.Hex(),
			UserName: document.UserName,
			FullName: document.FullName,
			IsAdmin:  document.IsAdmin,
		})
	}
	return results
}

func (um UsersMongoDBConnector) Update(user models.User) {
	id, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": bson.M{
			"user_name": user.UserName,
			"full_name": user.FullName,
			"is_admin":  user.IsAdmin,
		},
	}
	_, err = um.Collect.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}
}

func (um UsersMongoDBConnector) Delete(id string) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter := bson.M{"_id": objID}
	_, err = um.Collect.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
}
