package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.model.Cafeteria
import com.example.conectabook.data.api.repository.CafeteriaRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class CafeteriaViewModel : ViewModel() {

    private val repository = CafeteriaRepository()

    private val _cafeterias = MutableStateFlow<List<Cafeteria>>(emptyList())
    val cafeterias: StateFlow<List<Cafeteria>> = _cafeterias

    private val _busca = MutableStateFlow("")
    val busca: StateFlow<String> = _busca

    fun setBusca(valor: String) {
        _busca.value = valor
    }

    fun carregar() {
        viewModelScope.launch {
            try {
                _cafeterias.value = repository.listarCafeterias()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}