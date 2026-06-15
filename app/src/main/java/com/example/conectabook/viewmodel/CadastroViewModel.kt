package com.example.conectabook.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.model.GeneroResponse
import com.example.conectabook.data.api.repository.AuthRepository
import com.example.conectabook.data.api.session.UserSession
import kotlinx.coroutines.launch

class CadastroViewModel : ViewModel() {

    private val repository = AuthRepository()

    var nome by mutableStateOf("")
    var nomeUsuario by mutableStateOf("")

    var email by mutableStateOf("")

    var dataNascimento by mutableStateOf(
        TextFieldValue("")
    )

    val dataNascimentoValida: Boolean
        get() {
            return try {
                java.time.LocalDate.parse(
                    dataNascimento.text,
                    java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
                )
                true
            } catch (e: Exception) {
                false
            }
        }

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
                dataNascimentoValida &&
                senhaTamanhoValido &&
                senhasIguais &&
                generoSelecionado != null &&
                !carregando

    var generos by mutableStateOf<List<GeneroResponse>>(emptyList())
    var generoSelecionado by mutableStateOf<GeneroResponse?>(null)

    fun cadastrar(){
        if (!habilitarCadastro) return

        viewModelScope.launch {
            carregando = true
            mensagemErro = null

            try {
                val resposta = repository.cadastrar(
                    nome = nome,
                    nomeUsuario = nomeUsuario.ifBlank {
                        nome.lowercase().replace(" ", "_")
                    },
                    email = email,
                    senha = senha,
                    dataNascimento = dataNascimento.text
                        .split("/")
                        .reversed()
                        .joinToString("-"),
                    generoFavorito = generoSelecionado!!.id_genero
                )

                if (resposta.status){

                    try {
                        val login = repository.login(email, senha)

                        if (login.status && login.user != null) {
                            UserSession.usuario = login.user
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }

                    cadastroSucesso = true

                } else {
                    mensagemErro = resposta.message ?: "Erro ao criar conta"
                }
            } catch (erro: Exception) {
                erro.printStackTrace()
                mensagemErro = "Erro ao conectar com o servidor"
            } finally {
                carregando = false
            }
        }
    }

    fun carregarGeneros(){

        viewModelScope.launch {
            try {
                generos = repository.listarGeneros()
            } catch (erro: Exception) {
//                mensagemErro = "Erro ao carregar gêneros"

                erro.printStackTrace()

                mensagemErro = erro.message
            }
        }
    }

    fun atualizarDataNascimento(valor: TextFieldValue) {

        val numeros = valor.text
            .filter { it.isDigit() }
            .take(8)

        val formatado = buildString {

            numeros.forEachIndexed { index, c ->

                append(c)

                if ((index == 1 || index == 3) &&
                    index < numeros.lastIndex
                ) {
                    append("/")
                }
            }
        }

        dataNascimento = TextFieldValue(
            text = formatado,
            selection = TextRange(formatado.length)
        )
    }

}