package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.dto.LivroDto
import com.example.conectabook.data.api.repository.LivroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LivroViewModel : ViewModel() {

    private val repository = LivroRepository()

    private val _livros = MutableStateFlow<List<LivroDto>>(emptyList())
    val livros: StateFlow<List<LivroDto>> = _livros

    fun buscarLivros(busca: String) {

        viewModelScope.launch {

            try {

                val resposta = repository.buscarLivros(busca)

                _livros.value = resposta.docs
            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
}