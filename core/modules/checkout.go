package modules

import (
	"Miscellaneous/models/interfaces"
	"Miscellaneous/models/structs"
	"Miscellaneous/plugins/grpcs"
	"context"
	"fmt"
	"strconv"
	"time"
)

type CheckoutModule struct {
	interfaces.CheckoutModel
}

func (cm CheckoutModule) CreateSale(profile *structs.User, products []structs.CheckoutItem) *structs.CoreError {
	report := [][]string{}
	total := 0.0
	UTC := time.Now().UnixMilli()
	for _, v := range products {
		product, err := productsModel.Get(context.Background(), &grpcs.IdRequest{Id: v.Id})
		if err != nil {
			return &structs.CoreError{
				IsInternal: true,
				Code:       "internal-error",
				Message:    "No se pudo obtener el producto.",
			}
		}

		if product == nil {
			continue
		}
		subTotal := product.Price * float64(v.Count)
		_, err = checkoutModel.CreateSale(context.Background(), &grpcs.CreateSaleArgs{
			Sale: &grpcs.NewSale{
				Product: v.Id,
				Count:   v.Count,
				Total:   subTotal,
			},
			IdUser: profile.Id,
			Date:   UTC,
		})
		if err != nil {
			return &structs.CoreError{
				IsInternal: true,
				Code:       "internal-error",
				Message:    "No se pudo crear la venta.",
			}
		}

		_, err = productsModel.UpdateStock(context.Background(), &grpcs.UpdateStockArgs{
			Id:    v.Id,
			Stock: 0 - v.Count,
		})
		if err != nil {
			return &structs.CoreError{
				IsInternal: true,
				Code:       "internal-error",
				Message:    "No se pudo actualizar el stock.",
			}
		}
		reportItem := []string{strconv.Itoa(int(v.Count)), product.Name, strconv.FormatFloat(subTotal, 'f', 2, 64)}
		report = append(report, reportItem)
		total += subTotal
	}
	fmt.Println(report)

	return nil
}

func (cm CheckoutModule) GetHistory(profile *structs.User) ([]structs.Sale, *structs.CoreError) {
	res, err := checkoutModel.GetHistory(context.Background(), &grpcs.IdRequest{Id: profile.Id})
	if err != nil {
		return nil, &structs.CoreError{
			IsInternal: true,
			Code:       "internal-error",
			Message:    "No se pudo obtener el historial de ventas.",
		}
	}

	sales := res.GetSales()
	results := []structs.Sale{}
	for _, v := range sales {
		results = append(results, structs.Sale{
			Id:      v.GetId(),
			Product: v.GetProduct(),
			User:    v.GetUser(),
			Date:    v.GetDate(),
			Count:   v.GetCount(),
			Total:   v.GetTotal(),
		})
	}

	return results, nil
}

func (cm CheckoutModule) DeleteSale(profile *structs.User, id string) *structs.CoreError {
	saleResult, err := historyModel.FindByID(context.Background(), &grpcs.IdRequest{Id: id})
	if saleResult == nil || err != nil {
		return nil
	}

	if saleResult.GetIdUser() != profile.Id && !profile.IsAdmin {
		return nil
	}

	product, err := productsModel.Get(context.Background(), &grpcs.IdRequest{Id: saleResult.GetIdProduct()})
	if product == nil || err != nil {
		return nil
	}

	productsModel.UpdateStock(context.Background(), &grpcs.UpdateStockArgs{
		Id:    product.GetId(),
		Stock: product.GetStock() + saleResult.GetCount(),
	})
	checkoutModel.DeleteSale(context.Background(), &grpcs.IdRequest{Id: id})

	return nil
}
