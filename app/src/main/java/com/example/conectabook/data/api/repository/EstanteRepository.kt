package com.example.conectabook.data.api.repository

import android.util.Log
import android.util.Log.e
import com.example.conectabook.data.api.ApiService
import com.example.conectabook.data.api.dto.AdicionarLivroRequest
import com.example.conectabook.data.api.dto.EstanteResponse
import kotlin.collections.emptyList

class EstanteRepository (private val apiService: ApiService) {

    suspend fun listarLendo(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarLendo(idUsuario).estantes
        } catch (e: Exception) {
            e.printStackTrace()
            Log.e("ESTANTE", "ERRO LENDO: ${e.message}")
            emptyList()
        }
    }

    suspend fun listarQueroLer(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarQueroLer(idUsuario).estantes
        } catch (e: Exception) {
            e.printStackTrace()
            Log.e("ESTANTE", "ERRO QUERO LER: ${e.message}")
            emptyList()
        }
    }

    suspend fun listarLidos(idUsuario: Int): List<EstanteResponse> {
        return try {
            apiService.listarLidos(idUsuario).estantes
        } catch (e: Exception) {
            e.printStackTrace()
            Log.e("ESTANTE", "ERRO LIDOS: ${e.message}")
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

            true

        } catch (e: retrofit2.HttpException) {

            Log.e(
                "ESTANTE",
                "HTTP ${e.code()} -> ${e.response()?.errorBody()?.string()}"
            )

            false

        } catch (e: Exception) {

            Log.e(
                "ESTANTE",
                e.stackTraceToString()
            )

            false
        }
    }
}