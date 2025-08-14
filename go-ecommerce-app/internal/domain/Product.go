package domain

import "time"

/**
json:"name" is used to serialize the field to json
gorm:"PrimaryKey" is used to make the field a primary key
db.AutoMigrate(&Product{}) will create the table with the fields
*/
type Product struct {
	ID          uint      `json:"id" gorm:"PrimaryKey"`
	Name        string    `json:"name" gorm:"index;"`
	Description string    `json:"description"`
	CategoryId  uint      `json:"category_id"`
	ImageUrl    string    `json:"image_url" `
	Price       float64   `json:"price"`
	UserId      int       `json:"user_id"`
	Stock       uint      `json:"stock"`
	CreatedAt   time.Time `json:"created_at" gorm:"default:current_timestamp"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"default:current_timestamp"`
}
