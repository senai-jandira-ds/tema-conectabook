package com.example.conectabook.screens

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.SearchBarLivros
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.conectabook.components.LivroCard
import com.example.conectabook.components.SecaoResumoEstante
import com.example.conectabook.data.api.model.Livro
import com.example.conectabook.navigation.Routes
import com.example.conectabook.viewmodel.EstanteViewModel
import com.example.conectabook.viewmodel.LivroViewModel

@Composable
fun LivrosScreen(
    navController: NavController,
    modifier: Modifier = Modifier,
    livroViewModel: LivroViewModel = viewModel(),
    estanteViewModel: EstanteViewModel = viewModel()
) {

    val colors = MaterialTheme.colorScheme
    var busca by remember { mutableStateOf("") }

    val livrosBusca by livroViewModel.livros.collectAsState()

    val livrosLendo by estanteViewModel.lendo.collectAsState()
    val livrosQueroLer by estanteViewModel.queroLer.collectAsState()

    val idUsuarioLogado = 31 // ID de teste fixado'

    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            // Toda vez que a tela voltar a ficar ativa (onResume), recarrega os dados do Azure
            if (event == Lifecycle.Event.ON_RESUME) {
                estanteViewModel.carregarEstante(idUsuarioLogado)
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
    }


    Scaffold(
        bottomBar = {
            BottomBar(navController = navController)
        }
    ) {
        paddingValues ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(colors.background)
                .padding(paddingValues)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {

            item {
                SearchBarLivros(
                    busca = busca,
                    onBuscaChange = {
                        busca = it

                        if (it.isNotBlank()) {
                            livroViewModel.buscarLivros(it)
                        }
                                    },
                    onCameraClick = {}
                )
            }

            // Se o usuário não estiver buscando nada, mostra o Resumo e a Estante Real
            if (busca.isBlank()) {
                item {
                    Text(
                        text = "Resumo",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.onBackground
                    )
                }

//            item {
//                Text(
//                    text = "Resumo",
//                    fontSize = 18.sp,
//                    fontWeight = FontWeight.SemiBold,
//                    color = colors.onBackground
//                )
//            }

            item {
                SecaoResumoEstante()
            }

//            items(livros) { livro ->
//
//                LivroCard(
//                    capaUrl = livro.capaUrl,
//                    titulo = livro.titulo,
//                    autor = livro.autor,
//                    ano = livro.anoPublicacao,
//                    onClick = {}
//                )
//
//            }

//            if (busca.isBlank()) {

                // --- SESSÃO: LENDO ---
                if (livrosLendo.isNotEmpty()) {
                    item {
                        Text(
                            text = "Lendo atualmente",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    items(livrosLendo) { livro ->
                        LivroCard(
                            capaUrl = livro.capaUrl,
                            titulo = livro.titulo,
                            autor = livro.autor,
                            ano = livro.anoPublicacao,
                            onClick = {
                                livroViewModel.selecionarLivro(livro)
                                navController.navigate("detalhes_livro/${Uri.encode(livro.id)}")
                            }
                        )
                    }
                }

                // --- SESSÃO: QUERO LER ---
                if (livrosQueroLer.isNotEmpty()) {
                    item {
                        Text(
                            text = "Quero Ler",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    items(livrosQueroLer) { livro ->
                        LivroCard(
                            capaUrl = livro.capaUrl,
                            titulo = livro.titulo,
                            autor = livro.autor,
                            ano = livro.anoPublicacao,
                            onClick = {
                                livroViewModel.selecionarLivro(livro)
                                navController.navigate("detalhes_livro/${Uri.encode(livro.id)}")
                            }
                        )
                    }
                }

            } else {
                // Se o usuário digitou algo na busca, mostra o resultado da pesquisa
                items(livrosBusca) { livro ->
                    LivroCard(
                        capaUrl = livro.capaUrl,
                        titulo = livro.titulo,
                        autor = livro.autor,
                        ano = livro.anoPublicacao,
                        onClick = {
                            livroViewModel.selecionarLivro(livro)
                            navController.navigate("detalhes_livro/${Uri.encode(livro.id)}")
                        }
                    )
                }
            }
        }
    }
}