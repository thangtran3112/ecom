package domain

import "time"

/**
json:"name" is used to serialize the field to json
gorm:"PrimaryKey" is used to make the field a primary key
db.AutoMigrate(&Category{}) will create the table with the fields
*/
type Category struct {
	ID           uint      `json:"id" gorm:"PrimaryKey"`
	Name         string    `json:"name" gorm:"index;"`
	ParentId     uint      `json:"parent_id"` // no gorm tag, but still becomes a column
	ImageUrl     string    `json:"image_url" `
	Products     []Product `json:"products"` // one to many relationship
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at" gorm:"default:current_timestamp"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}

// CREATE TABLE categories (
//     id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255),
//     parent_id INT UNSIGNED,
//     image_url VARCHAR(255),
//     display_order INT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );