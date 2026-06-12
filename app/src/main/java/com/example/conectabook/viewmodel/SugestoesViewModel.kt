package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.model.Livro
import com.example.conectabook.data.api.repository.LivroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SugestoesViewModel : ViewModel() {

    private val repository = LivroRepository()

    private val _livrosSugeridos =
        MutableStateFlow<List<Livro>>(emptyList())

    val livrosSugeridos: StateFlow<List<Livro>> =
        _livrosSugeridos

    fun carregarSugestoes(genero: String) {

        viewModelScope.launch {

            try {

                val resposta = repository.buscarLivros(genero)

                _livrosSugeridos.value =
                    resposta.docs.map { dto ->

                        Livro(
                            id = dto.key,
                            titulo = dto.title,
                            autor = dto.author_name?.firstOrNull()
                                ?: "Autor desconhecido",
                            capaUrl = dto.cover_i?.let {
                                "https://covers.openlibrary.org/b/id/$it-L.jpg"
                            },
                            descricao = null,
                            anoPublicacao = dto.first_publish_year,
                            paginas = null,
                            idioma = null,
                            generos = emptyList()
                        )
                    }

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}