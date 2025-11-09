package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type Products struct{}

func (p *Products) CreateProduct(data structs.NewProduct) error {
	err := modules.Products.Create(data)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (p *Products) GetProducts() []structs.Product {
	results, _ := modules.Products.GetAll()
	return results
}

func (p *Products) GetFilterProducts(query string) []structs.Product {
	results, _ := modules.Products.Find(query)
	return results
}

func (p *Products) UpdateProduct(data structs.DataProduct) error {
	err := modules.Products.Update(data)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (p *Products) DeleteProduct(id string) error {
	err := modules.Products.Delete(id)
	if err != nil {
		return errors.ProcessError(err)
	}

	return nil
}
