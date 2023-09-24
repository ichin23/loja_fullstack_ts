CREATE DATABASE Loja;
USE Loja;

CREATE TABLE usuario(
	id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(20),
    email varchar(100),
    nome varchar(100),
    senha varchar(100)
);

CREATE TABLE categoria(
	id INT PRIMARY KEY auto_increment,
    nome varchar(150)
);

CREATE TABLE produto(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nome varchar(150),
    descricao varchar(1500),
    imagePath varchar(200),
    categoriaID INT,
    FOREIGN KEY (categoriaID) REFERENCES categoria(id)
);

INSERT INTO usuario(nome, email, senha, username) VALUES ("pedro", "pedro@email.com", "123456", "ichin23")