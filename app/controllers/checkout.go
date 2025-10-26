package controllers

import (
	"Miscellaneous/core"
	"Miscellaneous/core/models"
	"fmt"
	"strconv"
	"time"
)

type Checkout struct{}

func (c *Checkout) SaveCheckout(products []models.ProductGroup) {
	report := [][]string{}
	total := 0
	UTC := time.Now().UnixMilli()
	for _, v := range products {
		subTotal := v.Price * v.Count
		core.Checkout.CreateSale(models.NewSale{
			Product: v.Id,
			Count:   v.Count,
			Total:   subTotal,
		}, profile.Id, UTC)
		core.Products.Update(models.DataProduct{
			Id:          v.Id,
			Name:        v.Name,
			Description: v.Description,
			Sku:         v.Sku,
			Price:       v.Price,
			Stock:       v.Stock - v.Count,
			MinStock:    v.MinStock,
			IdProvider:  v.Provider.Id,
		})
		reportItem := []string{strconv.Itoa(v.Count), v.Name, strconv.Itoa(subTotal)}
		report = append(report, reportItem)
		total += subTotal
	}
	fmt.Println(report)
}

func (c *Checkout) GetHistory() []models.Sale {
	return core.Checkout.GetHistory(profile.Id)
}

func (c *Checkout) RestoreHistory(id int) {
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
