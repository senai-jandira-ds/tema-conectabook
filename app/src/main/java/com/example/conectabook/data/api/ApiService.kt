package com.example.conectabook.data.api


import com.example.conectabook.data.api.model.LoginRequest
import com.example.conectabook.data.api.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse
}