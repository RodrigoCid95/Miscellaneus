package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"context"
)

type ProvidersModule struct {
	interfaces.ProvidersModel
}

func (pm ProvidersModule) Create(data structs.NewProvider) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-name",
			Message:    "Falta el nombre del proveedor.",
		}
	}
	if data.Phone == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-phone",
			Message:    "Falta el número de teléfono.",
		}
	}

	_, err := providersClient.Create(context.Background(), &grpcs.NewProvider{
		Name:  data.Name,
		Phone: data.Phone,
	})

	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo crear el proveedor.",
		}
	}

	return nil
}

func (pm ProvidersModule) GetAll() ([]structs.Provider, *structs.CoreError) {
	res, err := providersClient.GetAll(context.Background(), &grpcs.Empty{})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener la lista de proveedores.",
		}
	}

	providerList := res.GetProviders()
	results := []structs.Provider{}
	for _, v := range providerList {
		results = append(results, structs.Provider{
			Id:    v.GetId(),
			Name:  v.GetName(),
			Phone: v.GetPhone(),
		})
	}

	return results, nil
}

func (pm ProvidersModule) Update(data structs.Provider) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-name",
			Message:    "Falta el nombre del proveedor.",
		}
	}
	if data.Phone == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-phone",
			Message:    "Falta el número de teléfono.",
		}
	}

	_, err := providersClient.Update(context.Background(), &grpcs.Provider{
		Id:    data.Id,
		Name:  data.Name,
		Phone: data.Phone,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo actualizar el proveedor.",
		}
	}

	return nil
}

func (pm ProvidersModule) Delete(id string) *structs.CoreError {
	_, err := providersClient.Delete(context.Background(), &grpcs.IdRequest{Id: id})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo eliminar el proveedor.",
		}
	}

	return nil
}
