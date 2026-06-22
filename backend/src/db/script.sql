DROP TABLE IF EXISTS VendaItem;
DROP TABLE IF EXISTS Venda;
DROP TABLE IF EXISTS Favorito;
DROP TABLE IF EXISTS CarrinhoItem;
DROP TABLE IF EXISTS Carrinho;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Produto;

-- =========================
-- PRODUTO
-- =========================
CREATE TABLE Produto (
  ProCodigo INT PRIMARY KEY,
  ProNome VARCHAR(100) NOT NULL,
  ProDesc VARCHAR(255),
  ProPreco DECIMAL(10,2) NOT NULL,
  ProEstoque INT NOT NULL,
  ProImagem VARCHAR(255)
);

-- =========================
-- USUARIO
-- =========================
CREATE TABLE Usuario (
  UsuCodigo INT AUTO_INCREMENT PRIMARY KEY,
  UsuNome VARCHAR(100) NOT NULL,
  UsuEmail VARCHAR(255) NOT NULL UNIQUE,
  UsuSenha VARCHAR(255) NOT NULL,
  UsuRole VARCHAR(20) NOT NULL DEFAULT 'user',
  UsuDataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CARRINHO
-- =========================
CREATE TABLE Carrinho (
  CarCodigo INT AUTO_INCREMENT PRIMARY KEY,
  UsuCodigo INT NOT NULL,
  CarDataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT FK_Carrinho_Usuario
    FOREIGN KEY (UsuCodigo)
    REFERENCES Usuario(UsuCodigo)
    ON DELETE CASCADE
);

-- =========================
-- ITENS DO CARRINHO
-- =========================
CREATE TABLE CarrinhoItem (
  CarItemCodigo INT AUTO_INCREMENT PRIMARY KEY,
  CarCodigo INT NOT NULL,
  ProCodigo INT NOT NULL,
  Quantidade INT NOT NULL DEFAULT 1,

  CONSTRAINT FK_CarrinhoItem_Carrinho
    FOREIGN KEY (CarCodigo)
    REFERENCES Carrinho(CarCodigo)
    ON DELETE CASCADE,

  CONSTRAINT FK_CarrinhoItem_Produto
    FOREIGN KEY (ProCodigo)
    REFERENCES Produto(ProCodigo)
    ON DELETE CASCADE
);

-- =========================
-- FAVORITOS
-- =========================
CREATE TABLE Favorito (
  FavCodigo INT AUTO_INCREMENT PRIMARY KEY,
  UsuCodigo INT NOT NULL,
  ProCodigo INT NOT NULL,

  CONSTRAINT FK_Favorito_Usuario
    FOREIGN KEY (UsuCodigo)
    REFERENCES Usuario(UsuCodigo)
    ON DELETE CASCADE,

  CONSTRAINT FK_Favorito_Produto
    FOREIGN KEY (ProCodigo)
    REFERENCES Produto(ProCodigo)
    ON DELETE CASCADE,

  UNIQUE (UsuCodigo, ProCodigo)
);

-- =========================
-- VENDA
-- =========================
CREATE TABLE Venda (
  VenCodigo INT AUTO_INCREMENT PRIMARY KEY,
  UsuCodigo INT NOT NULL,
  VenData TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  VenTotal DECIMAL(10,2) NOT NULL,

  CONSTRAINT FK_Venda_Usuario
    FOREIGN KEY (UsuCodigo)
    REFERENCES Usuario(UsuCodigo)
);

-- =========================
-- ITENS DA VENDA
-- =========================
CREATE TABLE VendaItem (
  VenItemCodigo INT AUTO_INCREMENT PRIMARY KEY,
  VenCodigo INT NOT NULL,
  ProCodigo INT NOT NULL,
  Quantidade INT NOT NULL,
  PrecoUnitario DECIMAL(10,2) NOT NULL,

  CONSTRAINT FK_VendaItem_Venda
    FOREIGN KEY (VenCodigo)
    REFERENCES Venda(VenCodigo)
    ON DELETE CASCADE,

  CONSTRAINT FK_VendaItem_Produto
    FOREIGN KEY (ProCodigo)
    REFERENCES Produto(ProCodigo)
);

INSERT INTO Produto
(ProCodigo, ProNome, ProDesc, ProPreco, ProEstoque, ProImagem)
VALUES
(9, 'Queijo Canastra', 'Queijo curado artesanal da Serra da Canastra', 34.90, 12, 'queijo_canastra.png'),
(10, 'Doce de Leite', 'Tradicional doce de leite mineiro feito no tacho', 26.50, 18, 'doce_de_leite.png'),
(11, 'Mel Puro', 'Mel natural extraído diretamente dos apiários', 22.90, 15, 'mel_puro.jpg'),
(12, 'Leite Fresco', 'Leite integral fresco direto da fazenda', 8.50, 20, 'leite_fresco.avif'),
(13, 'Requeijão Caseiro', 'Requeijão cremoso artesanal da roça', 15.90, 14, 'requeijao_caseiro.png'),
(14, 'Cachaça Artesanal', 'Cachaça envelhecida em barril de carvalho', 45.00, 8, 'cachaca_artesanal.jpg'),
(15, 'Compota de Figo', 'Compota artesanal de figo feita no tacho', 17.50, 9, 'compota_figo.jpg'),
(16, 'Geleia de Morango', 'Geleia natural sem conservantes', 13.90, 18, 'geleia_morango.jpg');