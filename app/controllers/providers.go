package controllers

import (
	"Miscellaneous/core/modules"
	"Miscellaneous/errors"
	"Miscellaneous/models/structs"
)

type Providers struct{}

func (p *Providers) SaveProvider(newProvider structs.NewProvider) error {
	if err := modules.Providers.Create(newProvider); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (p *Providers) GetProviders() ([]structs.Provider, error) {
	results, err := modules.Providers.GetAll()
	if err != nil {
		return results, errors.ProcessError(err)
	}

	return results, nil
}

func (p *Providers) UpdateProvider(data structs.Provider) error {
	if err := modules.Providers.Update(data); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}

func (p *Providers) DeleteProvider(id string) error {
	if err := modules.Providers.Delete(id); err != nil {
		return errors.ProcessError(err)
	}

	return nil
}
