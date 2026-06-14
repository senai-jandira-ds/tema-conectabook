package com.example.conectabook.data.api.dto

data class MensagemResponse(
    val id_mensagem: Int,
    val comentario: String?,
    val arquivo: String?,
    val data_postagem: String,
    val id_usuario: Int,
    val id_clube: Int?,
    val id_mensagem_pai: Int?
)