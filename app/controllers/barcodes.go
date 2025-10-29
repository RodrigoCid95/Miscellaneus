package controllers

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type BarCodes struct{}

func (bc *BarCodes) CreateBarCode(data models.NewBarCode) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del Código de barras.")
	}
	if data.Value == "" {
		return utils.NewError("missing-value", "Falta el valor del Código de barras.")
	}

	core.BarCodes.Create(data)

	return nil
}

func (bc *BarCodes) GetBarCodes() []models.BarCode {
	return core.BarCodes.GetAll()
}

func (bc *BarCodes) UpdateBarCode(data models.BarCode) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del Código de barras.")
	}
	if data.Value == "" {
		return utils.NewError("missing-value", "Falta el valor del Código de barras.")
	}

	core.BarCodes.Update(data)

	return nil
}

func (bc *BarCodes) DeleteBarCode(id string) {
	core.BarCodes.Delete(id)
}

func (bc *BarCodes) GetBarCodeSrc(id string) string {
	barcode := core.BarCodes.Get(id)
	if bc == nil {
		return ""
	}

	return utils.GenerateDataURLBarcode(barcode.Value, barcode.Tag)
}
