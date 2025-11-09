package structs

import "encoding/gob"

type BarCode struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Tag   string `json:"tag"`
	Value string `json:"value"`
}

type NewBarCode struct {
	Name  string `json:"name"`
	Tag   string `json:"tag"`
	Value string `json:"value"`
}

func init() {
	gob.Register(NewBarCode{})
	gob.Register(BarCode{})
	gob.Register([]BarCode{})
}
