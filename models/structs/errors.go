package structs

type CoreError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	IsInternal bool   `json:"isInternal"`
}
