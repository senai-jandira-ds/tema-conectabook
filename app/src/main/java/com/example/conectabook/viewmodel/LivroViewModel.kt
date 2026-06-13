package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.model.Livro
import com.example.conectabook.data.api.repository.LivroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LivroViewModel : ViewModel() {

    private val repository = LivroRepository()

    private val _livros = MutableStateFlow<List<Livro>>(emptyList())
    val livros: StateFlow<List<Livro>> = _livros

    private val _livroSelecionado = MutableStateFlow<Livro?>(null)
    val livroSelecionado: StateFlow<Livro?> = _livroSelecionado


    fun buscarLivros(busca: String) {

        viewModelScope.launch {
            try {
                val resposta = repository.buscarLivros(busca)

                _livros.value = resposta.docs.map { dto ->

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

    fun selecionarLivro(livro: Livro) {
        _livroSelecionado.value = livro
    }


    fun buscarLivroPorId(id: String) {

        val cleanId = id.replace("/works/", "")

        viewModelScope.launch {
            try {
                val livro = repository.buscarLivroPorIdApi(cleanId)
                _livroSelecionado.value = livro
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}