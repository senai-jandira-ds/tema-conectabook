package com.example.conectabook.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.OpenLibraryApi
import com.example.conectabook.data.api.RetrofitClient
import com.example.conectabook.data.api.RetrofitInstance
import com.example.conectabook.data.api.model.Livro
import com.example.conectabook.data.api.repository.EstanteRepository
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class EstanteViewModel(
    private val estanteRepository: EstanteRepository = EstanteRepository(RetrofitClient.api),
    private val openLibraryApi: OpenLibraryApi = RetrofitInstance.api
) : ViewModel() {

    private val _lendo = MutableStateFlow<List<Livro>>(emptyList())
    val lendo: StateFlow<List<Livro>> = _lendo.asStateFlow()

    private val _queroLer = MutableStateFlow<List<Livro>>(emptyList())
    val queroLer: StateFlow<List<Livro>> = _queroLer.asStateFlow()

    private val _lidos = MutableStateFlow<List<Livro>>(emptyList())
    val lidos: StateFlow<List<Livro>> = _lidos.asStateFlow()

    fun carregarEstante(idUsuario: Int) {
        viewModelScope.launch {

            println("USUARIO = $idUsuario")

            val lendoIds = estanteRepository.listarLendo(idUsuario)
            println("LENDO = $lendoIds")

            val queroLerIds = estanteRepository.listarQueroLer(idUsuario)
            println("QUERO LER = $queroLerIds")

            val lidosIds = estanteRepository.listarLidos(idUsuario)
            println("LIDOS = $lidosIds")

            println("LENDO = $lendoIds")
            println("QUERO LER = $queroLerIds")
            println("LIDOS = $lidosIds")

            try {
                // Pega os IDs da estante
                val lendoIds = estanteRepository.listarLendo(idUsuario).map { it.id_livro }
                val queroLerIds = estanteRepository.listarQueroLer(idUsuario).map { it.id_livro }
                val lidosIds = estanteRepository.listarLidos(idUsuario).map { it.id_livro }

                // Converte os IDs em objetos Livro completos
                _lendo.value = buscarDetalhesDosLivros(lendoIds)
                _queroLer.value = buscarDetalhesDosLivros(queroLerIds)
                _lidos.value = buscarDetalhesDosLivros(lidosIds)
            } catch (e: Exception) {
                // Tratamento de erro
            }
        }
    }

    // Chamada paralela usando Coroutines
    private suspend fun buscarDetalhesDosLivros(ids: List<String>): List<Livro> = coroutineScope {
        ids.map { id ->
            async {
                try {
                    val workDto = openLibraryApi.buscarLivroPorId(id)

                    // Mapeia o DTO da Open Library para o modelo de UI "Livro"
                    Livro(
                        id = id,
                        titulo = workDto.title,
                        autor = "Autor consultado via ID",
                        descricao = workDto.description?.toString() ?: "Sem descrição disponível",
                        paginas = null,
                        idioma = "Não especificado",
                        capaUrl = workDto.covers?.firstOrNull()?.let { idCapa ->
                            "https://covers.openlibrary.org/b/id/$idCapa-M.jpg"
                        },
                        anoPublicacao = workDto.firstPublishDate?.take(4)?.toIntOrNull()
                    )
                } catch (e: Exception) {
                    null // Se falhar a busca de um livro, retorna nulo para filtrar depois
                }
            }
        }.awaitAll().filterNotNull()
    }

    fun adicionarLivro(idUsuario: Int, idStatus: Int, idLivro: String) {
        viewModelScope.launch {
            val sucesso = estanteRepository.adicionarLivro(idUsuario, idStatus, idLivro)
            if (sucesso) {
                carregarEstante(idUsuario)

            // Atualiza a tela automaticamente
            }
        }
    }
}