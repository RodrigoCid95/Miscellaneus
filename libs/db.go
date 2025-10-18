package libs

import (
	"Miscellaneous/utils"
	"database/sql"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func init() {
	dataPath := filepath.Join(".", ".data")
	if !utils.DirExists(dataPath) {
		utils.Mkdir(dataPath)
	}
	dbPath := filepath.Join(".", ".data", "system.db")
	db, err := sql.Open("sqlite", dbPath)
	DB = db
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

	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		db.Exec(
			"INSERT INTO users (user_name, full_name, hash, is_admin) VALUES (?, ?, ?, ?)",
			"admin", "Admin",
			"5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", true,
		)
	}
}
