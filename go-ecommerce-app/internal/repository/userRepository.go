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

	// Cart
	FindCartItems(uId uint) ([]domain.Cart, error)
	FindCartItem(uId uint, pId uint) (domain.Cart, error)
	CreateCart(c domain.Cart) error
	UpdateCart(c domain.Cart) error
	DeleteCartById(id uint) error
	DeleteCartItems(uId uint) error

	// Order
	CreateOrder(o domain.Order) error
	FindOrders(uId uint) ([]domain.Order, error)
	FindOrderById(id uint, uId uint) (domain.Order, error)

	// Profile
	CreateProfile(e domain.Address) error
	UpdateProfile(e domain.Address) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{
		db: db,
	}
}

func (r userRepository) CreateOrder(o domain.Order) error {
	err := r.db.Create(&o).Error
	if err != nil {
		log.Printf("error on creating order %v", err)
		return errors.New("failed to create order")
	}
	return nil
}

func (r userRepository) FindOrders(uId uint) ([]domain.Order, error) {
	var orders []domain.Order
	err := r.db.Where("user_id=?", uId).Find(&orders).Error
	if err != nil {
		log.Printf("error on fetching orders %v", err)
		return nil, errors.New("failed to fetch orders")
	}
	return orders, nil
}

func (r userRepository) FindOrderById(id uint, uId uint) (domain.Order, error) {
	var order domain.Order
	err := r.db.Preload("Items").Where("id=? AND user_id=?", id, uId).First(&order).Error
	if err != nil {
		log.Printf("error on fetching order %v", err)
		return domain.Order{}, errors.New("failed to fetch order")
	}
	return order, nil
}

func (repository userRepository) CreateUser(usr domain.User) (domain.User, error) {

	err := repository.db.Create(&usr).Error

	if err != nil {
		log.Printf("create user error %v", err)
		return domain.User{}, errors.New("failed to create user")
	}

	return usr, nil
}

func (r userRepository) FindUser(email string) (domain.User, error) {

	var user domain.User

	// Preload is used to load related Address data
	err := r.db.Preload("Address").First(&user, "email=?", email).Error

	if err != nil {
		log.Printf("find user error %v", err)
		return domain.User{}, errors.New("user does not exist")
	}

	return user, nil
}

// Notes:this would be chunky if we return all orders
// We may need to remove the orders from the response
func (r userRepository) FindUserById(id uint) (domain.User, error) {

	var user domain.User

	// Preload is used to load related data before returning the user
	err := r.db.Preload("Address").
		Preload("Cart").
		Preload("Orders").
		First(&user, id).Error

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

// FindCartItems is used to find all cart items by user id
func (r userRepository) FindCartItems(uId uint) ([]domain.Cart, error) {
	var carts []domain.Cart
	err := r.db.Where("user_id=?", uId).Find(&carts).Error
	return carts, err
}

// FindCartItem is used to find a cart item by user id and product id
func (r userRepository) FindCartItem(userId uint, productId uint) (domain.Cart, error) {
	cartItem := domain.Cart{}
	err := r.db.Where("user_id=? AND product_id=?", userId, productId).First(&cartItem).Error
	return cartItem, err
}

func (repo userRepository) CreateCart(cart domain.Cart) error {
	return repo.db.Model(&domain.Cart{}).Create(&cart).Error
}

func (r userRepository) UpdateCart(c domain.Cart) error {
	var cart domain.Cart
	err := r.db.Model(&cart).Clauses(clause.Returning{}).Where("id=?", c.ID).Updates(c).Error
	return err
}

func (r userRepository) DeleteCartById(id uint) error {
	err := r.db.Delete(&domain.Cart{}, id).Error
	return err
}

func (r userRepository) DeleteCartItems(uId uint) error {
	err := r.db.Where("user_id=?", uId).Delete(&domain.Cart{}).Error
	return err
}

func (r userRepository) CreateProfile(e domain.Address) error {
	err := r.db.Create(&e).Error
	if err != nil {
		log.Printf("error on creating profile with address %v", err)
		return errors.New("failed to create profile")
	}
	return nil
}

func (r userRepository) UpdateProfile(e domain.Address) error {

	err := r.db.Where("user_id=?", e.UserId).Updates(e).Error
	if err != nil {
		log.Printf("error on update profile with address %v", err)
		return errors.New("failed to create profile")
	}
	return nil

}