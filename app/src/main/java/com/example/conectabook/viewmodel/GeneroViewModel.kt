package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.model.GeneroResponse
import com.example.conectabook.data.api.repository.GeneroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class GeneroViewModel : ViewModel() {

    private val repository = GeneroRepository()

    private val _generos =
        MutableStateFlow<List<GeneroResponse>>(emptyList())

    val generos: StateFlow<List<GeneroResponse>>
            = _generos

    fun carregarGeneros() {

        viewModelScope.launch {

            try {

                _generos.value =
                    repository.listarGeneros()

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }
}