package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type BarCodes struct{}

func (bc *BarCodes) CreateBarCode(data structs.NewBarCode) error {
	err := modules.BarCodes.Create(data)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (bc *BarCodes) GetBarCodes() ([]structs.BarCode, error) {
	results, err := modules.BarCodes.GetAll()
	if err != nil {
		return results, errors.ProcessError(err)
	}

	return results, nil
}

func (bc *BarCodes) UpdateBarCode(data structs.BarCode) error {
	err := modules.BarCodes.Update(data)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (bc *BarCodes) DeleteBarCode(id string) error {
	err := modules.BarCodes.Delete(id)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (bc *BarCodes) GetBarCodeSrc(id string) (string, error) {
	src, err := modules.BarCodes.GetSrc(id)
	if err != nil {
		return "", errors.ProcessError(err)
	}

	return src, nil
}
