package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.dto.MensagemResponse
import com.example.conectabook.data.api.repository.MensagemRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlin.collections.emptyList

class MensagemViewModel: ViewModel() {

    private val repository = MensagemRepository()

    private val _mensagens =
        MutableStateFlow<List<MensagemResponse>>(emptyList())

    val mensagens: StateFlow<List<MensagemResponse>>
            = _mensagens

    fun carregarMensagens() {

        viewModelScope.launch {

            try {

                _mensagens.value =
                    repository.listarMensagens()

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
}