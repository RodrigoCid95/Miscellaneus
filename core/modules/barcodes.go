package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"Miscellaneous/utils/barcodes"
	"context"
	"fmt"
)

type BarcodesModule struct {
	interfaces.BarCodesModel
}

func (bc BarcodesModule) Create(data structs.NewBarCode) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			Code:       "missing-name",
			Message:    "Falta el nombre del Código de barras.",
			IsInternal: false,
		}
	}
	if data.Value == "" {
		return &structs.CoreError{
			Code:       "missing-value",
			Message:    "Falta el valor del Código de barras.",
			IsInternal: false,
		}
	}

	_, err := barcodesModel.Create(context.Background(), &grpcs.NewBarCode{
		Name:  data.Name,
		Tag:   data.Tag,
		Value: data.Value,
	})
	if err != nil {
		fmt.Printf("Error en BarcodesModule(CreateBarCode): %v\n", err)
		return &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo crear el Código de barras.",
			IsInternal: true,
		}
	}
	return nil
}

func (bc BarcodesModule) GetAll() ([]structs.BarCode, *structs.CoreError) {
	res, err := barcodesModel.GetAll(context.Background(), &grpcs.Empty{})
	if err != nil {
		fmt.Printf("Error en BarcodesModule(GetAll): %v\n", err)
		return nil, &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo obtener los Códigos de barras.",
			IsInternal: true,
		}
	}

	barcodes := res.GetBarcodes()
	results := []structs.BarCode{}
	for _, barcode := range barcodes {
		results = append(results, structs.BarCode{
			Id:    barcode.GetId(),
			Name:  barcode.GetName(),
			Tag:   barcode.GetTag(),
			Value: barcode.GetValue(),
		})
	}
	return results, nil
}

func (bc BarcodesModule) Update(data structs.BarCode) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			Code:       "missing-name",
			Message:    "Falta el nombre del Código de barras.",
			IsInternal: false,
		}
	}
	if data.Value == "" {
		return &structs.CoreError{
			Code:       "missing-value",
			Message:    "Falta el valor del Código de barras.",
			IsInternal: false,
		}
	}

	_, err := barcodesModel.Update(context.Background(), &grpcs.BarCode{
		Id:    data.Id,
		Name:  data.Name,
		Tag:   data.Tag,
		Value: data.Value,
	})
	if err != nil {
		fmt.Printf("Error en BarcodesModule(Update): %v\n", err)
		return &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo actualizar el Código de barras.",
			IsInternal: true,
		}
	}

	return nil
}

func (bc BarcodesModule) Delete(id string) *structs.CoreError {
	_, err := barcodesModel.Delete(context.Background(), &grpcs.IdRequest{Id: id})
	if err != nil {
		fmt.Printf("Error en BarcodesModule(Delete): %v\n", err)
		return &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo eliminar el Código de barras.",
			IsInternal: true,
		}
	}

	return nil
}

func (bc BarcodesModule) GetSrc(id string) (string, *structs.CoreError) {
	barcode, err := barcodesModel.Get(context.Background(), &grpcs.IdRequest{Id: id})
	result := ""
	if err != nil {
		return result, &structs.CoreError{
			Code:       "internal-error",
			Message:    "No se pudo obtener el Código de barras.",
			IsInternal: true,
		}
	}

	result = barcodes.GenerateDataURLBarcode(barcode.Value, barcode.Tag)

	return result, nil
}
