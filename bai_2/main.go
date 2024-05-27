package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func processArticle(id int, title string, catID int, lang int, lastUpdate, createdDate string) {
	fmt.Println(id, title, catID, lang, lastUpdate, createdDate)
}

func main() {
	dsn := "username:password@tcp(127.0.0.1:3306)/dbname"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	const batchSize = 10000
	offset := 0

	for {
		query := fmt.Sprintf("SELECT id, title, cat_id, lang, last_update, created_date FROM wikipedia_article LIMIT %d OFFSET %d", batchSize, offset)
		rows, err := db.Query(query)
		if err != nil {
			log.Fatal(err)
		}

		rowCount := 0

		for rows.Next() {
			var id int
			var title string
			var catID int
			var lang int
			var lastUpdate string
			var createdDate string

			err := rows.Scan(&id, &title, &catID, &lang, &lastUpdate, &createdDate)
			if err != nil {
				log.Fatal(err)
			}

			processArticle(id, title, catID, lang, lastUpdate, createdDate)
			rowCount++
		}

		rows.Close()

		if rowCount == 0 {
			break
		}

		offset += rowCount
	}

	fmt.Println("Processing complete.")
}
