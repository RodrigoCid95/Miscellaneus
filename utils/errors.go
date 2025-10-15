package utils

import (
	"encoding/json"
	"errors"
)

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewError(code string, message string) error {
	data, _ := json.Marshal(APIError{Code: code, Message: message})
	return errors.New(string(data))
}
