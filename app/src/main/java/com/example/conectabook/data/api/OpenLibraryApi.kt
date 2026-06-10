package com.example.conectabook.data.api

import com.example.conectabook.data.api.dto.BuscarLivrosResponse
import retrofit2.http.GET
import retrofit2.http.Query

interface OpenLibraryApi {

    @GET("search.json")
    suspend fun buscarLivros (
        @Query("q") busca: String
    ): BuscarLivrosResponse

}