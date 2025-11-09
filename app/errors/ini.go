package errors

import (
	"Miscellaneous/models/structs"
	"encoding/json"
	"errors"
)

type APIError struct {
	Status  int32  `json:"status"`
	Code    string `json:"code"`
	Message string `json:"message"`
}

func ProcessError(err *structs.CoreError) error {
	data, _ := json.Marshal(APIError{Code: err.Code, Message: err.Message})
	return errors.New(string(data))
}
