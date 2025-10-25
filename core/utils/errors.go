package utils

import (
	"encoding/json"
	"errors"
	"net/http"
)

type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func NewError(code string, message string) error {
	data, _ := json.Marshal(APIError{Code: code, Message: message})
	return errors.New(string(data))
}

func APIBadRequest(code string, message string) (int, map[string]string) {
	return http.StatusBadRequest, map[string]string{"code": code, "message": message}
}

func APIInternalError() (int, map[string]string) {
	return http.StatusInternalServerError, map[string]string{"code": "internal-error", "message": "Ocurrió un error interno, intentalo más tarde."}
}
