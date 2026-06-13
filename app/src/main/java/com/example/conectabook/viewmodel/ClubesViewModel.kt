package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.dto.ClubeResponse
import com.example.conectabook.data.api.repository.ClubeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlin.collections.emptyList

class ClubeViewModel : ViewModel() {

    private val repository = ClubeRepository()

    private val _clubes =
        MutableStateFlow<List<ClubeResponse>>(emptyList())

    val clubes: StateFlow<List<ClubeResponse>> =
        _clubes

    fun carregarClubes() {

        viewModelScope.launch {

            try {

                val resultado = repository.listarClubes()

                println("CLUBES RECEBIDOS = ${resultado.size}")
ss
                _clubes.value = resultado

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}