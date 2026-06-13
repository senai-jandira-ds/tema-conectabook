package com.example.conectabook.data.api.model

data class LoginResponse(
    val token: String,
    val usuarios: UsuarioResponse? = null
)

data class UsuarioResponse(
    val id: Int,
    val nome: String,
    val email: String
)