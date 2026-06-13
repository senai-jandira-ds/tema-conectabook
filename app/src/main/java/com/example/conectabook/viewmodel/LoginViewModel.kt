package com.example.conectabook.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

class LoginViewModel: ViewModel() {

    var email by mutableStateOf("")
    var senha by mutableStateOf("")

    var emailErro by mutableStateOf(false)
    var senhaErro by mutableStateOf(false)


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
                senhaTamanhoValido

    fun onEmailChange(novoEmail: String) {
        email= novoEmail
        emailErro = false
    }

    fun onSenhaChange(novaSenha: String) {
        if (novaSenha.length <=100) {
            senha = novaSenha
            senhaErro = false
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

}