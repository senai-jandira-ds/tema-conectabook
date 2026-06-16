package com.example.conectabook.data.api.dto

data class CafeteriaDTO(
    val id: Int,
    val nome: String,
    val descricao: String,
    val imagemUrl: String? = null,
    val avaliacao: Double,
    val cidade: String,
    val wifi: Boolean,
    val silencio: Boolean
)