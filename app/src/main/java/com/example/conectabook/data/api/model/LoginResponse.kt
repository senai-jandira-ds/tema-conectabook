package com.example.conectabook.data.api.model

data class LoginResponse(
    val status: Boolean,
    val status_code: Int,
    val user: UserResponse?
)

data class UserResponse(
    val id: Int,
    val nome: String,
    val nome_usuario: String?,
    val email: String,
    val foto_perfil: String?,
    val data_nascimento: String?,
    val genero_favorito: String?,
    val token: String?

)