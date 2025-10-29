package controllers

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"fmt"
	"strconv"
	"time"
)

type Checkout struct{}

func (c *Checkout) SaveCheckout(products []models.CheckoutItem) {
	report := [][]string{}
	total := 0.0
	UTC := time.Now().UnixMilli()
	for _, v := range products {
		product := core.Products.Get(v.Id)
		if product == nil {
			continue
		}
		subTotal := product.Price * float64(v.Count)
		core.Checkout.CreateSale(models.NewSale{
			Product: v.Id,
			Count:   v.Count,
			Total:   subTotal,
		}, profile.Id, UTC)
		core.Products.UpdateStock(v.Id, v.Count)
		reportItem := []string{strconv.Itoa(v.Count), product.Name, strconv.FormatFloat(subTotal, 'f', 5, 64)}
		report = append(report, reportItem)
		total += subTotal
	}
	fmt.Println(report)
}

func (c *Checkout) GetHistory() []models.Sale {
	return core.Checkout.GetHistory(profile.Id)
}

func (c *Checkout) RestoreHistory(id string) {
	saleResult := core.History.FindByID(id)
	if saleResult == nil {
		return
	}

	if saleResult.IdUser != profile.Id && !profile.IsAdmin {
		return
	}

	product := core.Products.Get(saleResult.IdProduct)
	if product == nil {
		return
	}

	core.Products.Update(models.DataProduct{
		Id:          product.Id,
		Name:        product.Name,
		Description: product.Description,
		Sku:         product.Sku,
		Price:       product.Price,
		Stock:       product.Stock + saleResult.Count,
		MinStock:    product.MinStock,
		IdProvider:  product.Provider.Id,
	})
	core.Checkout.DeleteSale(id)
}
