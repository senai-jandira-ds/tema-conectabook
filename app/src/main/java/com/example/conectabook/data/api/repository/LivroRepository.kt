package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitClient.api
import com.example.conectabook.data.api.RetrofitInstance
import com.example.conectabook.data.api.dto.BuscarLivrosResponse
import com.example.conectabook.data.api.model.Livro
import kotlin.collections.emptyList

class LivroRepository {

    private val api = RetrofitInstance.api

    suspend fun buscarLivros(busca: String): BuscarLivrosResponse {
        return RetrofitInstance.api.buscarLivros(busca)

    }

    suspend fun buscarLivroPorIdApi(id: String): Livro {

        val cleanId = id.replace("/works/", "")

        val response = api.buscarLivroPorId(cleanId)

        return Livro(
            id = response.key,
            titulo = response.title,
            autor = response.authors
                ?.firstOrNull()
                ?.author
                ?.key ?: "Desconhecido",
            capaUrl = response.covers?.firstOrNull()?.let {
                "https://covers.openlibrary.org/b/id/$it-L.jpg"
            },
            descricao = response.description?.toString(),
            anoPublicacao = response.firstPublishDate?.toIntOrNull(),
            paginas = null,
            idioma = null,
            generos = emptyList()
        )
    }
}