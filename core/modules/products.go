package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"context"
)

type ProductsModule struct {
	interfaces.ProductsModel
}

func serializeProducts(list *grpcs.ProductList) []structs.Product {
	productList := list.GetProducts()
	results := []structs.Product{}
	for _, v := range productList {
		results = append(results, structs.Product{
			Id:          v.GetId(),
			Name:        v.GetName(),
			Description: v.GetDescription(),
			Sku:         v.GetSku(),
			Price:       v.GetPrice(),
			Stock:       int(v.GetStock()),
			MinStock:    int(v.GetMinStock()),
			Provider: structs.Provider{
				Id:    v.GetProvider().GetId(),
				Name:  v.GetProvider().GetName(),
				Phone: v.GetProvider().GetPhone(),
			},
		})
	}

	return results
}

func (pm ProductsModule) Create(data structs.NewProduct) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-name",
			Message:    "Falta un nombre.",
		}
	}

	if data.Description == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-description",
			Message:    "Falta una descripción.",
		}
	}

	if data.Sku == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-sku",
			Message:    "Falta un SKU.",
		}
	}

	if data.Price == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-price",
			Message:    "Falta un precio.",
		}
	}

	if data.Stock == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-stock",
			Message:    "Falta un stock inicial.",
		}
	}

	if data.MinStock == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-min-stock",
			Message:    "Falta un stock mínimo.",
		}
	}

	if data.IdProvider == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-provider",
			Message:    "Falta un proveedor.",
		}
	}

	_, err := productsModel.Create(context.Background(), &grpcs.NewProduct{
		Name:        data.Name,
		Description: data.Description,
		Sku:         data.Sku,
		Price:       data.Price,
		Stock:       int32(data.Stock),
		MinStock:    int32(data.MinStock),
		IdProvider:  data.IdProvider,
	})

	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo crear el producto.",
		}
	}

	return nil
}

func (pm ProductsModule) GetAll() ([]structs.Product, *structs.CoreError) {
	res, err := productsModel.GetAll(context.Background(), &grpcs.Empty{})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener la lista de productos.",
		}
	}

	return serializeProducts(res), nil
}

func (pm ProductsModule) Find(query string) ([]structs.Product, *structs.CoreError) {
	res, err := productsModel.Find(context.Background(), &grpcs.QueryRequest{Query: query})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener la lista de productos.",
		}
	}

	return serializeProducts(res), nil
}

func (pm ProductsModule) Update(data structs.DataProduct) *structs.CoreError {
	if data.Name == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-name",
			Message:    "Falta un nombre.",
		}
	}

	if data.Description == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-description",
			Message:    "Falta una descripción.",
		}
	}

	if data.Sku == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-sku",
			Message:    "Falta un SKU.",
		}
	}

	if data.Price == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-price",
			Message:    "Falta un precio.",
		}
	}

	if data.Stock == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-stock",
			Message:    "Falta un stock inicial.",
		}
	}

	if data.MinStock == 0 {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-min-stock",
			Message:    "Falta un stock mínimo.",
		}
	}

	if data.IdProvider == "" {
		return &structs.CoreError{
			IsInternal: false,
			Code:       "missing-provider",
			Message:    "Falta un proveedor.",
		}
	}

	_, err := productsModel.Update(context.Background(), &grpcs.DataProduct{
		Id:          data.Id,
		Name:        data.Name,
		Description: data.Description,
		Sku:         data.Sku,
		Price:       data.Price,
		Stock:       int32(data.Stock),
		MinStock:    int32(data.MinStock),
		IdProvider:  data.IdProvider,
	})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo actualizar el producto.",
		}
	}

	return nil
}

func (pm ProductsModule) Delete(id string) *structs.CoreError {
	_, err := productsModel.Delete(context.Background(), &grpcs.IdRequest{Id: id})
	if err != nil {
		return &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo eliminar el producto.",
		}
	}

	return nil
}
