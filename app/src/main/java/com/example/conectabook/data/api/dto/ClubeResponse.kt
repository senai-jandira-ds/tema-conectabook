package com.example.conectabook.data.api.dto

data class ClubeResponse (
    val id_clube: Int,
    val nome: String,
    val foto: String,
    val sobre: String,
    val genero: String,
    val total_membros: Int
)