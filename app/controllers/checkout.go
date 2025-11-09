package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type Checkout struct{}

func (c *Checkout) SaveCheckout(products []structs.CheckoutItem) error {
	err := modules.Checkout.CreateSale(profile, products)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (c *Checkout) GetHistory() ([]structs.Sale, error) {
	results, err := modules.Checkout.GetHistory(profile)
	if err != nil {
		return results, errors.ProcessError(err)
	}
	return results, nil
}

func (c *Checkout) RestoreHistory(id string) error {
	err := modules.Checkout.DeleteSale(profile, id)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}
