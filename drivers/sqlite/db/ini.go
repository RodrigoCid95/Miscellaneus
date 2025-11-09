package db

import (
	"Miscellaneous/utils/config"
	"Miscellaneous/utils/paths"
	"database/sql"

	_ "modernc.org/sqlite"
)

type sqliteConfig struct {
	Path string `ini:"path"`
}

var Client *sql.DB

func init() {
	configPath := paths.ResolvePath("miscellaneous.conf")
	configDriver := config.ConfigDriver{Path: configPath}
	configNameSection := "SQLite"

	data := sqliteConfig{
		Path: "misc.db",
	}
	if !configDriver.HasSection(configNameSection) {
		configDriver.PutData(configNameSection, &data)
	}

	dbPath := paths.ResolvePath(data.Path)
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
