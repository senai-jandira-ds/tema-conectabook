package com.example.conectabook.data.api.model

data class GenerosApiResponse(
    val status: Boolean,
    val status_code: Int,
    val response: List<GeneroResponse>
)