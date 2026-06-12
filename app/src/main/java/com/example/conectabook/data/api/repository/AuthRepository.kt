package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.model.CadastroRequest
import com.example.conectabook.data.api.model.GeneroUsuarioRequest
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
        senha: String,
        dataNascimento: String,
        generoFavorito: Int
    ) =
        RetrofitClient.api.cadastrarUsuario(
            CadastroRequest(
                nome = nome,
                nome_usuario = nomeUsuario,
                email = email,
                senha = senha,
                data_nascimento = dataNascimento,
                generoFavorito
            )
        )

    suspend fun listarGeneros() =
        RetrofitClient.api.listarGeneros()

    suspend fun salvarGeneroUsuario(
        idUsuario: Int,
        idGenero: Int
    ) =
        RetrofitClient.api.salvarGeneroUsuario(
            GeneroUsuarioRequest(
                id_usuario = idUsuario,
                id_genero = idGenero
            )
        )

}