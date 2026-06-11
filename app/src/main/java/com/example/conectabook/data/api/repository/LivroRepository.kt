package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitInstance
import com.example.conectabook.data.api.dto.BuscarLivrosResponse

class LivroRepository {

    suspend fun buscarLivros(busca: String): BuscarLivrosResponse {

        return RetrofitInstance.api.buscarLivros(busca)

    }
}