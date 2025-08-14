# Golang ecom project

## Basic Golang commands

```zsh
    go mod init <Module_Name>
    go mod tidy
    go mod download
    go run *.go
```

## Starting watched server

```zsh
    make server
```

## Install dependencies

```zsh
    go get -u gorm.io/gorm
    go get -u gorm.io/driver/postgres
    go get github.com/golang-jwt/jwt/v4
```

## Architecture

![PostgresSQL Design](./DatabaseDesign.png)
![Architecture](./MultiSellerDesign.png)
