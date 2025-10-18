package controllers

import (
	"Miscellaneous/models"
	"Miscellaneous/utils"
)

type BarCodes struct{}

func (bc *BarCodes) CreateBarCode(data models.NewBarCode) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del Código de barras.")
	}
	if data.Value == "" {
		return utils.NewError("missing-value", "Falta el valor del Código de barras.")
	}

	models.BarCodes.Create(data)

	return nil
}

func (bc *BarCodes) GetBarCodes() []models.BarCode {
	return models.BarCodes.GetAll()
}

func (bc *BarCodes) UpdateBarCode(data models.BarCode) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del Código de barras.")
	}
	if data.Value == "" {
		return utils.NewError("missing-value", "Falta el valor del Código de barras.")
	}

	models.BarCodes.Update(data)

	return nil
}

func (bc *BarCodes) DeleteBarCode(id int) {
	models.BarCodes.Delete(id)
}

func (bc *BarCodes) GetBarCodeSrc(id int) string {
	barcode := models.BarCodes.Get(id)
	if bc == nil {
		return ""
	}

	return utils.GenerateDataURLBarcode(barcode.Value, barcode.Tag)
}
