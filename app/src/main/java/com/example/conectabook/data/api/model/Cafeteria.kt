package com.example.conectabook.data.api.model

data class Cafeteria(
    val nome: String,
    val descricao: String,
    val imagemUrl: String? = null,
    val wifi: Boolean = false,
    val silencio: Boolean = false,
    val avaliacao: Double = 4.5
)