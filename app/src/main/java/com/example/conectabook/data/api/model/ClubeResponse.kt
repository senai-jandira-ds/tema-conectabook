package com.example.conectabook.data.api.model

data class ClubeListaUi(

    val  id: Int,
    val nome: String,
    val descricao: String,
    val imagemUrl: String?,
    val genero: String,
    val totalMembros: Int,
    val participando : Boolean,
    val admin: Boolean

)