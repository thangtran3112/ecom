package repository

import (
	"errors"
	"go-ecommerce-app/internal/domain"
	"log"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UserRepository interface {
	CreateUser(usr domain.User) (domain.User, error)
	FindUser(email string) (domain.User, error)
	FindUserById(id uint) (domain.User, error)
	UpdateUser(id uint, u domain.User) (domain.User, error)
	CreateBankAccount(bankAccount domain.BankAccount) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		db: db,
	}
}

func (repository userRepository) CreateUser(usr domain.User) (domain.User, error) {

	err := repository.db.Create(&usr).Error

	if err != nil {
		log.Printf("create user error %v", err)
		return domain.User{}, errors.New("failed to create user")
	}

	return usr, nil
}

func (repository userRepository) FindUser(email string) (domain.User, error) {
	var user domain.User

	err := repository.db.First(&user, "email = ?", email).Error

	if err != nil {
		log.Printf("find user error %v", err)
		return domain.User{}, errors.New("user does not exist")
	}

	return user, nil
}

func (r userRepository) FindUserById(id uint) (domain.User, error) {

	var user domain.User

	err := r.db.First(&user, id).Error

	if err != nil {
		log.Printf("find user error %v", err)
		return domain.User{}, errors.New("user does not exist")
	}

	return user, nil
}

// UPDATE users 
// SET first_name = ?, last_name = ?, email = ?, ... 
// WHERE id = ? 
// RETURNING *;
func (r userRepository) UpdateUser(id uint, inputUser domain.User) (domain.User, error) {
    var user domain.User
    
	// Updates only non-zero fields from inputUser with Updates method
	// Clauses(clause.Returning{}) is used to return the updated row
    result := r.db.Model(&user).Clauses(clause.Returning{}).
        Where("id=?", id).Updates(inputUser)
    
    if result.Error != nil {
        return domain.User{}, result.Error
    }
    
    if result.RowsAffected == 0 {
        return domain.User{}, errors.New("user not found")
    }
    
    return user, nil
}

func (r userRepository) CreateBankAccount(bankAccount domain.BankAccount) error {
	return r.db.Create(&bankAccount).Error
}