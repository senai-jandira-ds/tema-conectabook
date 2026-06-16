package com.example.conectabook.data.api.dto

data class EstanteApiResponse(
    val status_code: Int,
    val estantes: List<EstanteResponse>
)