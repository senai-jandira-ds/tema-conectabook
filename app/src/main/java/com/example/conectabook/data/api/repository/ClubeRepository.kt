package com.example.conectabook.data.api.repository

import androidx.compose.runtime.mutableStateListOf
import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.RetrofitInstance
import com.example.conectabook.data.api.dto.ClubeResponse
import com.example.conectabook.data.api.model.ClubeListaUi
import okhttp3.MultipartBody
import okhttp3.RequestBody

class ClubeRepository {

    suspend fun listarClubes(): List<ClubeResponse> {

        val resposta = RetrofitClient.api.listarClubes()

        return resposta.response
    }

    suspend fun criarClube(
        nome: RequestBody,
        sobre: RequestBody,
        regras: RequestBody,
        idGenero: RequestBody,
        foto: MultipartBody.Part?
    ) =
        RetrofitClient.api.criarClube(
            nome,
            sobre,
            regras,
            idGenero,
            foto
        )

}