CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE Curso (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Semestre (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    curso_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (curso_id) REFERENCES Curso(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Cadeira (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    semestre_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (semestre_id) REFERENCES Semestre(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id) ON DELETE CASCADE
);

CREATE TABLE Calendario (
    id SERIAL PRIMARY KEY,
    cadeira_id INT UNIQUE NOT NULL,
    FOREIGN KEY (cadeira_id) REFERENCES Cadeira(id) ON DELETE CASCADE
);

CREATE TABLE Evento (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    calendario_id INT NOT NULL,
    FOREIGN KEY (calendario_id) REFERENCES Calendario(id) ON DELETE CASCADE
);

CREATE TABLE Caderno (
    id SERIAL PRIMARY KEY,
    cadeira_id INT UNIQUE NOT NULL,
    FOREIGN KEY (cadeira_id) REFERENCES Cadeira(id) ON DELETE CASCADE
);

CREATE TABLE Documento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    dataUpload DATE NOT NULL,
    caderno_id INT NOT NULL,
    FOREIGN KEY (caderno_id) REFERENCES Caderno(id) ON DELETE CASCADE
);

CREATE TABLE Anotacao (
    id SERIAL PRIMARY KEY,
    conteudo TEXT NOT NULL,
    dataCriacao DATE NOT NULL,
    caderno_id INT NOT NULL,
    FOREIGN KEY (caderno_id) REFERENCES Caderno(id) ON DELETE CASCADE
);

CREATE TABLE PlanoEstudo (
    id SERIAL PRIMARY KEY,
    cadeira_id INT UNIQUE NOT NULL,
    FOREIGN KEY (cadeira_id) REFERENCES Cadeira(id) ON DELETE CASCADE
);

CREATE TABLE Tarefa (
    id SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL,
    prazo DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    planoEstudo_id INT NOT NULL,
    FOREIGN KEY (planoEstudo_id) REFERENCES PlanoEstudo(id) ON DELETE CASCADE
);

CREATE TABLE Avaliacao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    peso FLOAT NOT NULL,
    nota FLOAT,
    cadeira_id INT NOT NULL,
    FOREIGN KEY (cadeira_id) REFERENCES Cadeira(id) ON DELETE CASCADE
);
