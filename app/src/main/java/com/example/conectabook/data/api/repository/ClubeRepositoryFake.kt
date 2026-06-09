package com.example.conectabook.data.api.repository

import androidx.compose.runtime.mutableStateListOf
import com.example.conectabook.data.api.model.ClubeListaUi

object ClubeRepositoryFake {
    val clubes = mutableStateListOf<ClubeListaUi>()
}