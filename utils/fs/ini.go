package fs

import "os"

func DirExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	if err != nil {
		return false
	}
	return info.IsDir()
}

func FileExists(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	if err != nil {
		return false
	}
	return !info.IsDir()
}

func Mkdir(path string) {
	if err := os.MkdirAll(path, 0755); err != nil {
		panic(err)
	}
}

func WriteFile(path string, data string) {
	if err := os.WriteFile(path, []byte(data), 0644); err != nil {
		panic(err)
	}
}

func ReadFile(path string) []byte {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	return content
}
