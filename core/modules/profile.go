package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/crypto"
	"context"
)

type ProfileModule struct {
	interfaces.ProfileModel
}

func (pm ProfileModule) UpdateProfile(args interfaces.UpdateProfileArgs) *structs.CoreError {
	if args.Data.UserName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "user-name-not-found",
			Message:    "Falta el nombre de usuario.",
		}
	}
	if args.Data.FullName == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "name-not-found",
			Message:    "Falta el nombre completo.",
		}
	}

	res, err := usersModel.Get(context.Background(), &grpcs.UserNameRequest{
		UserName: args.Data.UserName,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener el usuario.",
		}
	}

	if res.GetUser() != nil && res.GetUser().GetId() != args.Id {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "user-already-exist",
			Message:    "El usuario " + args.Data.UserName + " ya existe.",
		}
	}

	_, err = profileModel.UpdateProfile(context.Background(), &grpcs.UpdateProfileArgs{
		Data: &grpcs.ProfileData{
			UserName: args.Data.UserName,
			FullName: args.Data.FullName,
		},
		Id: args.Id,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo actualizar el perfil.",
		}
	}

	return nil
}

func (pm ProfileModule) UpdatePassword(args interfaces.UpdatePasswordArgs) *structs.CoreError {
	if args.Data.CurrentPassword == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-current-password",
			Message:    "Falta al contraseña actual.",
		}
	}

	if args.Data.NewPassword == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-new-password",
			Message:    "Falta la nueva contraseña.",
		}
	}

	user, err := usersModel.Get(context.TODO(), &grpcs.UserNameRequest{UserName: args.Profile.UserName})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener el usuario.",
		}
	}

	hash := crypto.GenerateHash(args.Data.CurrentPassword)
	if user.GetUser().GetHash() != hash {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "wrong-password",
			Message:    "La contraseña es incorrecta.",
		}
	}

	_, err = profileModel.UpdatePassword(context.Background(), &grpcs.UpdatePasswordArgs{
		Id:       args.Profile.Id,
		Password: args.Data.NewPassword,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo actualizar la contraseña.",
		}
	}

	return nil
}
