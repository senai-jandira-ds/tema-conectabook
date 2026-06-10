package com.example.conectabook.data.api.dto

data class LivroDto(
    val key: String,
    val title: String,
    val author_name: List<String>?,
    val cover_i: Int?,
    val first_publish_year: Int?
)