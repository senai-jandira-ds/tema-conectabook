package com.example.conectabook.data.api


import com.example.conectabook.data.api.model.CadastroRequest
import com.example.conectabook.data.api.model.CadastroResponse
import com.example.conectabook.data.api.model.LoginRequest
import com.example.conectabook.data.api.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("v1/conectaBook/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @POST("v1/conectaBook/usuarios")
    suspend fun cadastrarUsuario(
        @Body request: CadastroRequest
    ): CadastroResponse

}