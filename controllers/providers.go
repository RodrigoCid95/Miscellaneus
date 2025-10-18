package controllers

import (
	"Miscellaneous/models"
	"Miscellaneous/utils"
)

type Providers struct{}

func (p *Providers) SaveProvider(newProvider models.NewProvider) error {
	if newProvider.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del proveedor.")
	}
	if newProvider.Phone == "" {
		return utils.NewError("missing-phone", "Falta el número de teléfono.")
	}

	models.Providers.Create(newProvider)

	return nil
}

func (p *Providers) GetProviders() *[]models.Provider {
	return models.Providers.GetAll()
}

func (p *Providers) UpdateProvider(data models.Provider) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del proveedor.")
	}
	if data.Phone == "" {
		return utils.NewError("missing-phone", "Falta el número de teléfono.")
	}

	models.Providers.Update(data)

	return nil
}

func (p *Providers) DeleteProvider(id int) {
	models.Providers.Delete(id)
}
