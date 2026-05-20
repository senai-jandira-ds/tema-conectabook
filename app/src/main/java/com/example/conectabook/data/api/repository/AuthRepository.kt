package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.model.CadastroRequest
import com.example.conectabook.data.api.model.LoginRequest

class AuthRepository{

    suspend fun login(email: String, senha: String) =
        RetrofitClient.api.login(
            LoginRequest(
                email = email,
                senha = senha
            )
        )

    suspend fun cadastrar(
        nome: String,
        nomeUsuario: String,
        email: String,
        senha: String
    ) =
        RetrofitClient.api.cadastrarUsuario(
            CadastroRequest(
                nome = nome,
                nome_usuario = nomeUsuario,
                email = email,
                senha = senha
            )
        )


}