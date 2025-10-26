package controllers

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"Miscellaneous/core/utils"
)

type Providers struct{}

func (p *Providers) SaveProvider(newProvider models.NewProvider) error {
	if newProvider.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del proveedor.")
	}
	if newProvider.Phone == "" {
		return utils.NewError("missing-phone", "Falta el número de teléfono.")
	}

	core.Providers.Create(newProvider)

	return nil
}

func (p *Providers) GetProviders() *[]models.Provider {
	return core.Providers.GetAll()
}

func (p *Providers) UpdateProvider(data models.Provider) error {
	if data.Name == "" {
		return utils.NewError("missing-name", "Falta el nombre del proveedor.")
	}
	if data.Phone == "" {
		return utils.NewError("missing-phone", "Falta el número de teléfono.")
	}

	core.Providers.Update(data)

	return nil
}

func (p *Providers) DeleteProvider(id int) {
	core.Providers.Delete(id)
}
