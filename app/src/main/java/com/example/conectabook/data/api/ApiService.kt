package com.example.conectabook.data.api


import com.example.conectabook.data.api.model.CadastroRequest
import com.example.conectabook.data.api.model.CadastroResponse
import com.example.conectabook.data.api.model.GeneroResponse
import com.example.conectabook.data.api.model.GeneroUsuarioRequest
import com.example.conectabook.data.api.model.LoginRequest
import com.example.conectabook.data.api.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST

interface ApiService {

   @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/usuarios")
    suspend fun cadastrarUsuario(
        @Body request: CadastroRequest
    ): CadastroResponse

    @GET("v1/conectaBook/generos")
    suspend fun listarGeneros(): List<GeneroResponse>

    @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/genero-usuario")
    suspend fun salvarGeneroUsuario(
        @Body request: GeneroUsuarioRequest
    ): CadastroResponse

}