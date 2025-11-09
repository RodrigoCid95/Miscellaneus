package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"context"
)

type UsersModule struct {
	interfaces.UsersModel
}

func (um UsersModule) Create(data structs.NewUser) *structs.CoreError {
	if data.UserName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-user-name",
			Message:    "Falta el nombre de usuario.",
		}
	}
	if data.FullName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-full-name",
			Message:    "Falta el nombre completo.",
		}
	}
	if data.Password == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-password",
			Message:    "Falta la contraseña.",
		}
	}

	res, err := usersModel.Get(context.Background(), &grpcs.UserNameRequest{UserName: data.UserName})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener el usuario.",
		}
	}

	user := res.GetUser()
	if user != nil {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "user-already",
			Message:    "El usuario " + data.UserName + " ya existe.",
		}
	}

	_, err = usersModel.Create(context.Background(), &grpcs.NewUser{
		UserName: data.UserName,
		FullName: data.FullName,
		IsAdmin:  data.IsAdmin,
		Password: data.Password,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "internal-error",
			Message:    "No se pudo crear el usuario.",
		}
	}

	return nil
}

func (um UsersModule) GetAll(profile *structs.User) ([]structs.User, *structs.CoreError) {
	res, err := usersModel.GetAll(context.Background(), &grpcs.Empty{})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    err.Error(),
		}
	}

	userList := res.GetUsers()
	results := []structs.User{}
	for _, v := range userList {
		if profile != nil && v.Id == profile.Id {
			continue
		}
		results = append(results, structs.User{
			Id:       v.GetId(),
			UserName: v.GetUserName(),
			FullName: v.GetFullName(),
			IsAdmin:  v.GetIsAdmin(),
		})
	}
	return results, nil
}

func (um UsersModule) Update(data structs.User) *structs.CoreError {
	if data.UserName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "user-name-not-found",
			Message:    "Falta el nombre de usuario.",
		}
	}
	if data.FullName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "name-not-found",
			Message:    "Falta el nombre completo.",
		}
	}

	res, err := usersModel.Get(context.Background(), &grpcs.UserNameRequest{UserName: data.UserName})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener el usuario.",
		}
	}

	user := res.GetUser()
	if user != nil && user.GetId() != data.Id {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "user-already-exist",
			Message:    "El usuario " + data.UserName + " ya existe.",
		}
	}

	_, err = usersModel.Update(context.Background(), &grpcs.User{
		Id:       data.Id,
		UserName: data.UserName,
		FullName: data.FullName,
		IsAdmin:  data.IsAdmin,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo actualizar el usuario.",
		}
	}

	return nil
}

func (um UsersModule) Delete(id string) *structs.CoreError {
	_, err := usersModel.Delete(context.Background(), &grpcs.IdRequest{Id: id})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo eliminar el usuario.",
		}
	}

	return nil
}
