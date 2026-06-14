package com.example.conectabook.data.api.model

data class CriarClubeRequest(
    val nome: String,
    val sobre: String,
    val regras: String,
    val id_genero: Int
)