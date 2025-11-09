package paths

import (
	"Miscellaneous/utils/fs"
	"os"
	"path/filepath"
)

var basePath string

func init() {
	basePath = resolveBasePath()
	if !fs.DirExists(basePath) {
		fs.Mkdir(basePath)
	}
}

func resolveBasePath() string {
	appName := "Miscellaneous"
	if appData := os.Getenv("APPDATA"); appData != "" {
		return filepath.Join(appData, appName)
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, appName)
	}

	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".config", appName)
}

func ResolvePath(elem ...string) string {
	return filepath.Join(basePath, filepath.Join(elem...))
}
