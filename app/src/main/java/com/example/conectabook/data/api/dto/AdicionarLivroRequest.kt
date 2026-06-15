package com.example.conectabook.data.api.dto

data class AdicionarLivroRequest(
    val id_usuario: Int,
    val id_status_livro: Int,
    val id_livro: String
)