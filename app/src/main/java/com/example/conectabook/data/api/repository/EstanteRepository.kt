package com.example.conectabook.data.api.repository

import android.util.Log
import com.example.conectabook.data.api.ApiService
import com.example.conectabook.data.api.dto.AdicionarLivroRequest
import com.example.conectabook.data.api.dto.EstanteResponse

class EstanteRepository (private val apiService: ApiService) {

    suspend fun listarLendo(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarLendo(idUsuario)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun listarQueroLer(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarQueroLer(idUsuario)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun listarLidos(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarLidos(idUsuario)
        } catch (e: Exception) {
            emptyList()
        }
    }

    // ... dentro do EstanteRepository

    suspend fun adicionarLivro(idUsuario: Int, idStatus: Int, idLivro: String): Boolean {
        return try {
            val request = AdicionarLivroRequest(
                id_usuario = idUsuario,
                id_status_livro = idStatus,
                id_livro = idLivro
            )
            apiService.adicionarLivro(request)
            true // API respondeu com sucesso (200 OK)
        } catch (e: Exception) {
            Log.e("EstanteRepository", "Erro ao adicionar: ${e.message}")
            false // Algum erro ocorreu
        }
    }
}