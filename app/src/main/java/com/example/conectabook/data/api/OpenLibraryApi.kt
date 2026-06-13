package com.example.conectabook.data.api

import com.example.conectabook.data.api.dto.BuscarLivrosResponse
import com.example.conectabook.data.api.dto.LivroDto
import com.example.conectabook.data.api.dto.LivroWorkDto
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface OpenLibraryApi {

    @GET("search.json")
    suspend fun buscarLivros (
        @Query("q") busca: String
    ): BuscarLivrosResponse

    @GET("works/{id}.json")
    suspend fun buscarLivroPorId(
        @Path("id") id: String
    ): LivroWorkDto

}