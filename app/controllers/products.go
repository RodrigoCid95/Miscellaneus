package controllers

import (
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type Products struct{}

func (p *Products) CreateProduct(data models.NewProduct) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta un nombre.")
	}

	if data.Description == "" {
		return utils.NewError("missing-description", "Falta una descripción.")
	}

	if data.Sku == "" {
		return utils.NewError("missing-sku", "Falta un SKU.")
	}

	if data.Price == 0 {
		return utils.NewError("missing-price", "Falta un precio.")
	}

	if data.Stock == 0 {
		return utils.NewError("missing-stock", "Falta un stock inicial.")
	}

	if data.MinStock == 0 {
		return utils.NewError("missing-min-stock", "Falta un stock mínimo.")
	}

	if data.IdProvider == 0 {
		return utils.NewError("missing-provider", "Falta un proveedor.")
	}

	models.Products.Create(data)

	return nil
}

func (p *Products) GetProducts() []models.Product {
	return models.Products.GetAll()
}

func (p *Products) GetFilterProducts(query string) []models.Product {
	return models.Products.Find(query)
}

func (p *Products) UpdateProduct(data models.DataProduct) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta un nombre.")
	}

	if data.Description == "" {
		return utils.NewError("missing-description", "Falta una descripción.")
	}

	if data.Sku == "" {
		return utils.NewError("missing-sku", "Falta un SKU.")
	}

	if data.Price == 0 {
		return utils.NewError("missing-price", "Falta un precio.")
	}

	if data.Stock == 0 {
		return utils.NewError("missing-stock", "Falta un stock inicial.")
	}

	if data.MinStock == 0 {
		return utils.NewError("missing-min-stock", "Falta un stock mínimo.")
	}

	if data.IdProvider == 0 {
		return utils.NewError("missing-provider", "Falta un proveedor.")
	}

	models.Products.Update(data)

	return nil
}

func (p *Products) DeleteProduct(id int) {
	models.Products.Delete(id)
}
