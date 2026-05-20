package com.example.conectabook.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.repository.AuthRepository
import kotlinx.coroutines.launch

class CadastroViewModel : ViewModel() {

    private val repository = AuthRepository()

    var nome by mutableStateOf("")
    var nomeUsuario by mutableStateOf("")
    var email by mutableStateOf("")

    var dataNascimento by mutableStateOf("")
    var senha by mutableStateOf("")
    var confirmarSenha by mutableStateOf("")

    var carregando by mutableStateOf(false)
    var cadastroSucesso by mutableStateOf(false)
    var mensagemErro by mutableStateOf<String?>(null)

    val senhaTamanhoValido: Boolean
        get() = senha.length in 8..100

    val senhasIguais: Boolean
        get() = senha == confirmarSenha && confirmarSenha.isNotEmpty()

    val habilitarCadastro: Boolean
        get() = nome.isNotBlank() &&
                email.isNotBlank() &&
                dataNascimento.isNotBlank() &&
                senhaTamanhoValido &&
                senhasIguais &&
                !carregando

    fun cadastrar(){
        if (!habilitarCadastro) return

        viewModelScope.launch {
            carregando = true
            mensagemErro = null

            try {
                val resposta = repository.cadastrar(
                    nome = nome,
                    nomeUsuario = nomeUsuario.ifBlank { nome.lowercase().replace(" ", "_") },
                    email = email,
                    senha = senha,
                    dataNascimento = dataNascimento.split("/").reversed().joinToString("-")
                )

                if (resposta.status){
                    cadastroSucesso = true
                } else {
                    mensagemErro = resposta.message ?: "Erro ao criar conta"
                }
            } catch (erro: Exception) {
                mensagemErro = erro.message ?: "Erro desconhecido"
            } finally {
                carregando = false
            }
        }
    }
}