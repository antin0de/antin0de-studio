package main

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectAndMigrateDatabase() *gorm.DB {
	dsn := os.Getenv("POSTGRESQL_CONNECTION_STR")

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect database")
	}

	return db
}
