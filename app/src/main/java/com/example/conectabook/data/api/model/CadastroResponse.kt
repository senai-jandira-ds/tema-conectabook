package com.example.conectabook.data.api.model

data class CadastroResponse(
    val status: Boolean,
    val status_code: Int,
    val message: String? = null
)