package com.example.conectabook.viewmodel

data class Livro (
    val id: String,
    val titulo: String,
    val autor: String,
    val capaUrl: String?,
    val descricao: String?,
    val anoPublicacao: Int?,
    val paginas: Int?,
    val idioma: String?,
    val generos: List<String> = emptyList()
)