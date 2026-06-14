package com.example.conectabook.data.api.dto

data class CriarClubeResponse(
    val status: Boolean,
    val status_code: Int,
    val response: ClubeCriadoResponse
)