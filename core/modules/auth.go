package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/crypto"
	"context"
)

type AuthModule struct {
	interfaces.AuthModel
}

func (a AuthModule) Login(data interfaces.LoginArgs) (*structs.User, *structs.CoreError) {
	if data.UserName == "" {
		return nil, &structs.CoreError{
			IsInternal: false,
			Code:       "missing-username",
			Message:    "El nombre de usuario es requerido.",
		}
	}
	if data.Password == "" {
		return nil, &structs.CoreError{
			IsInternal: false,
			Code:       "missing-password",
			Message:    "La contraseña es requerida.",
		}
	}

	res, err := usersModel.Get(context.Background(), &grpcs.UserNameRequest{UserName: data.UserName})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se puede obtener el usuario.",
		}
	}

	user := res.GetUser()
	if user == nil {
		return nil, &structs.CoreError{
			IsInternal: false,
			Code:       "user-not-found",
			Message:    "Usuario no encontrado.",
		}
	}

	hash := crypto.GenerateHash(data.Password)
	if hash != user.GetHash() {
		return nil, &structs.CoreError{
			IsInternal: false,
			Code:       "wrong-password",
			Message:    "La contraseña es incorrecta.",
		}
	}

	result := structs.User{
		Id:       user.GetId(),
		UserName: user.GetUserName(),
		FullName: user.GetFullName(),
		IsAdmin:  user.GetIsAdmin(),
	}
	return &result, nil
}
