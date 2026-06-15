package com.example.conectabook.data.api.session

import com.example.conectabook.data.api.model.UserResponse

object UserSession {

    var usuario: UserResponse? = null

    fun logout() {
        usuario = null
    }

    val logado: Boolean
        get() = usuario != null
}