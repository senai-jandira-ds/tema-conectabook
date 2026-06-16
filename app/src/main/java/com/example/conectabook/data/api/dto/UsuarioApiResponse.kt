package com.example.conectabook.data.api.dto

data class UsuarioApiResponse(
    val status: String? = null,
    val status_code: Int? = null,
    val response: UsuarioDTO? = null
)

data class UsuarioDTO(
    val id: Int,
    val nome: String,
    val nome_usuario: String,
    val email: String,
    val foto_perfil: String? = null,
    val data_nascimento: String? = null
)