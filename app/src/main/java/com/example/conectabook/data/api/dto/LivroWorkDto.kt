package com.example.conectabook.data.api.dto

import com.google.gson.annotations.SerializedName

data class LivroWorkDto(
    val key: String,
    val title: String,
    val authors: List<AuthorDto>?,
    val covers: List<Int>?,
    val description: Any?,

    @SerializedName("first_publish_date")
    val firstPublishDate: String? = null
)

data class AuthorDto(
    val author: AuthorKeyDto
)

data class AuthorKeyDto(
    val key: String
)