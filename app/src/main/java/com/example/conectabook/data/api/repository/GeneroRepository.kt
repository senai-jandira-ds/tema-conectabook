package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.model.GeneroResponse

class GeneroRepository {

    suspend fun listarGeneros(): List<GeneroResponse> {

        return RetrofitClient
            .api
            .listarGeneros()
            .response
    }
}