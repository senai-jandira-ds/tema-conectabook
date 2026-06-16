package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.ApiService
import com.example.conectabook.data.api.dto.UsuarioDTO

class UsuarioRepository(
    private val api: ApiService
) {

    suspend fun buscarUsuarioPorId(id: Int): UsuarioDTO? {
        val response = api.buscarUsuarioPorId(id)
        return response.response
    }
}