package db

import (
	"Miscellaneous/utils/assets"
	"Miscellaneous/utils/config"
	"Miscellaneous/utils/fs"
	"database/sql"
	"path/filepath"

	_ "modernc.org/sqlite"
)

type sqliteConfig struct {
	Name string `ini:"name"`
	Path string `ini:"path"`
}

type exteralSqliteConfig struct {
	Name string `flag:"name" env:"DB_NAME" usage:"Nombre de la base de datos."`
	Path string `flag:"path" env:"DB_PATH" usage:"Directorio de la base de datos."`
}

const configNameSection = "SQLite"

var Client *sql.DB

func init() {
	data := sqliteConfig{
		Name: "misc.db",
		Path: "",
	}
	if !config.ConfigController.HasSection(configNameSection) {
		config.ConfigController.PutData(configNameSection, &data)
	}

	config.ConfigController.GetData(configNameSection, &data)

	data.Path = assets.ResolvePath(data.Path)

	externalData := exteralSqliteConfig{}
	config.LoadExternalConfig(&externalData)

	if externalData.Path != "" {
		data.Path = fs.ResolvePath(externalData.Path)
	}

	if externalData.Name != "" {
		data.Name = externalData.Name
	}

	dbAssets := assets.Assets{Path: data.Path}
	dbPath := dbAssets.Resolve(data.Name)

	if !fs.FileExists(dbPath) {
		base := filepath.Dir(dbPath)
		if !fs.DirExists(base) {
			fs.Mkdir(base)
		}
		fs.WriteFile(dbPath, "")
	}

	db, err := sql.Open("sqlite", dbPath)
	Client = db
	if err != nil {
		panic(err)
	}
	barCodesQuery := "CREATE TABLE IF NOT EXISTS bar_codes (name TEXT, tag TEXT, value TEXT);"
	productsQuery := `
		CREATE TABLE IF NOT EXISTS products (
			name TEXT,
			description TEXT,
			sku TEXT,
			price NUMERIC,
			stock NUMERIC,
			min_stock NUMERIC,
			provider NUMERIC
		);
	`
	providersQuery := "CREATE TABLE IF NOT EXISTS providers (name TEXT, phone TEXT);"
	salesQuery := `
		CREATE TABLE IF NOT EXISTS sales (
			id_product NUMERIC,
			id_user NUMERIC,
			date NUMERIC,
			count NUMERIC,
			total NUMERIC
		);
	`
	usersQuery := "CREATE TABLE IF NOT EXISTS users (user_name TEXT, full_name TEXT, hash TEXT, is_admin INTEGER);"
	_, _ = db.Exec("PRAGMA journal_mode=WAL;")

	_, err = db.Exec(usersQuery)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(barCodesQuery)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(providersQuery)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(productsQuery)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(salesQuery)
	if err != nil {
		panic(err)
	}
}
