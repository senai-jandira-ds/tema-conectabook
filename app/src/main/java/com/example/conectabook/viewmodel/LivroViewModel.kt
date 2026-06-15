package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.model.Livro
import com.example.conectabook.data.api.repository.EstanteRepository
import com.example.conectabook.data.api.repository.LivroRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LivroViewModel : ViewModel() {

    private val repository = LivroRepository()

    private val estanteRepository = EstanteRepository(RetrofitClient.api)

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

    fun adicionarNaEstante(livroId: String, status: String) {
        // Converte a string do Dialog/UI para o ID numérico que o backend exige
        val idStatusLivro = when (status.lowercase()) {
            "quero ler" -> 1
            "lendo" -> 2
            "lido" -> 3
            else -> 1 // Fallback caso venha algo diferente
        }

        val cleanId = livroId.replace("/works/", "")
        val idUsuarioLogado = 31 // ID fixo que você mapeou no seu fluxo para testes

        viewModelScope.launch {
            try {
                val sucesso = estanteRepository.adicionarLivro(
                    idUsuario = idUsuarioLogado,
                    idStatus = idStatusLivro,
                    idLivro = cleanId
                )

                if (sucesso) {
                    // Opcional: Você pode postar um estado de sucesso para a UI mostrar um Toast
                    println("Livro adicionado com sucesso à estante!")
                } else {
                    println("Falha ao adicionar livro à estante.")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}