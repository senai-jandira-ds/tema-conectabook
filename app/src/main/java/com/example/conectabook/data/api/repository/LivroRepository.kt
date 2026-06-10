package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitInstance

class LivroRepository {

    suspend fun buscarLivros(busca: String) =
        RetrofitInstance.api.buscarLivros(busca)
}