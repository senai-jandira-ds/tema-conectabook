package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.dto.MensagemResponse

class MensagemRepository {

    suspend fun listarMensagens(): List<MensagemResponse> {

        return RetrofitClient.api
            .listarMensagens()
            .response
    }
}