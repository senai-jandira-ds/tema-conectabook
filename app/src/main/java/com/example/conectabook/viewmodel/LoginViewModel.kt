package com.example.conectabook.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.repository.AuthRepository
import com.example.conectabook.data.api.session.UserSession
import kotlinx.coroutines.launch

class LoginViewModel: ViewModel() {

    private val repository = AuthRepository()

    var email by mutableStateOf("")
    var senha by mutableStateOf("")

    var emailErro by mutableStateOf(false)
    var senhaErro by mutableStateOf(false)

    var carregando by mutableStateOf(false)
    var loginSucesso by mutableStateOf(false)
    var mensagemErro by mutableStateOf<String?>(null)

    private fun isEmailValido(): Boolean{
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

    val senhaTamanhoValido : Boolean
        get() = senha.length in 8..100

    val senhaSemSequencia: Boolean
        get() = !Regex("(123|abc)").containsMatchIn(senha.lowercase())

    val senhaSemRepeticao: Boolean
        get() = !Regex("(.)\\1{2,}").containsMatchIn(senha)

    val habilitarClicar: Boolean
        get() = email.isNotBlank() &&
                 isEmailValido() &&
                senhaTamanhoValido &&
                !carregando

    fun onEmailChange(novoEmail: String) {
        email= novoEmail
        emailErro = false
        mensagemErro = null
    }

    fun onSenhaChange(novaSenha: String) {
        if (novaSenha.length <=100) {
            senha = novaSenha
            senhaErro = false
            mensagemErro = null
        }
    }

    fun validarLogin(): Boolean {
        val emailValido = isEmailValido()

        val senhaValida = senhaTamanhoValido &&
                            senhaSemSequencia &&
                            senhaSemRepeticao

        emailErro = !emailValido
        senhaErro= !senhaValida

        return emailValido && senhaValida
    }

    fun login() {
        if (!validarLogin()) return

        viewModelScope.launch {
            carregando = true
            mensagemErro = null

            try {
                val resposta = repository.login(email, senha)

                if (resposta.status && resposta.user != null){
                    UserSession.usuario = resposta.user
                    loginSucesso = true
                } else {
                    mensagemErro = "Email ou senha inválidos"
                }
            } catch (erro: Exception) {

                erro.printStackTrace()

                mensagemErro =
                    erro.message ?:"Erro ao conectar com o servidor"
            } finally {
                carregando = false
            }
        }
    }
}