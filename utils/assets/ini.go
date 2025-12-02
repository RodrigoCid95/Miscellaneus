package assets

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
	if appData := os.Getenv("APPDATA"); appData != "" {
		return filepath.Join(appData, "Miscellaneous")
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, "miscellaneous")
	}

	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".miscellaneous")
}

type Assets struct {
	Path string
}

func (a Assets) Resolve(elem ...string) string {
	return filepath.Join(a.Path, filepath.Join(elem...))
}

func NewAssest(elem ...string) *Assets {
	path := ResolvePath(elem...)
	return &Assets{Path: path}
}

func ResolvePath(elem ...string) string {
	path := filepath.Join(elem...)
	if filepath.IsAbs(path) {
		return path
	}
	return filepath.Join(basePath, path)
}
