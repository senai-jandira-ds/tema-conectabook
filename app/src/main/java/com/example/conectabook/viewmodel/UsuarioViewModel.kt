package com.example.conectabook.viewmodel

import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.snapshots.SnapshotStateMap
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.dto.UsuarioDTO
import com.example.conectabook.data.api.repository.UsuarioRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class UsuarioViewModel : ViewModel() {

    private val repository = UsuarioRepository(RetrofitClient.api)

    private val _usuariosCache = MutableStateFlow<Map<Int, UsuarioDTO>>(emptyMap())
    val usuariosCache: StateFlow<Map<Int, UsuarioDTO>> = _usuariosCache

    fun buscarUsuarioPorId(id: Int) {
        viewModelScope.launch {

            // evita refetch
            if (_usuariosCache.value.containsKey(id)) return@launch

            try {
                val result = repository.buscarUsuarioPorId(id)

                if (result != null) {
                    _usuariosCache.value =
                        _usuariosCache.value + (id to result)
                }

            } catch (_: Exception) {}
        }
    }
}