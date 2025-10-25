package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

func GenerateHash(text string) string {
	hash := sha256.Sum256([]byte(text))
	return hex.EncodeToString(hash[:])
}
