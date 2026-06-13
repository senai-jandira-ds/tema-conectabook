package com.example.conectabook.data.api.repository

import androidx.compose.runtime.mutableStateListOf
import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.RetrofitInstance
import com.example.conectabook.data.api.dto.ClubeResponse
import com.example.conectabook.data.api.model.ClubeListaUi

class ClubeRepository {

    suspend fun listarClubes(): List<ClubeResponse> {

        val resposta = RetrofitClient.api.listarClubes()

        return resposta.response
    }

}