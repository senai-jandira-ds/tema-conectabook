package com.example.conectabook.data.api.model

data class CadastroRequest (
    val nome: String,
    val nome_usuario: String,
    val email: String,
    val senha: String,
    val data_nascimento: String
)