package com.example.conectabook.screens

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
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
import com.example.conectabook.data.api.session.UserSession
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

//    val livrosLendo by estanteViewModel.lendo.collectAsState()
//    val livrosQueroLer by estanteViewModel.queroLer.collectAsState()

    val livrosLendoFake = listOf(
        Livro(
            id = "MPBC001",
            titulo = "Memórias Póstumas de Brás Cubas",
            autor = "Machado de Assis",
            capaUrl = "https://covers.openlibrary.org/b/id/14822565-L.jpg",
            descricao = null,
            anoPublicacao = 1994,
            paginas = null,
            idioma = "Português"
        ),

        Livro(
            id = "SIT001",
            titulo = "Reinações de Narizinho",
            autor = "Monteiro Lobato",
            capaUrl = "https://covers.openlibrary.org/b/id/8316994-L.jpg",
            descricao = null,
            anoPublicacao = 2019,
            paginas = null,
            idioma = "Português"
        ),
        Livro(
            id = "HARRY001",
            titulo = "Harry Potter e a Pedra Filosofal",
            autor = "J.K. Rowling",
            capaUrl = "https://covers.openlibrary.org/b/id/15155851-L.jpg",
            descricao = null,
            anoPublicacao = 2022,
            paginas = null,
            idioma = "Português"
        )

    )

    val livrosQueroLerFake = listOf(
        Livro(
            id = "PP001",
            titulo = "O Pequeno Príncipe",
            autor = "Antoine de Saint-Exupéry",
            capaUrl = "https://covers.openlibrary.org/b/id/15096605-L.jpg",
            descricao = null,
            anoPublicacao = 2000,
            paginas = null,
            idioma = "Português"
        ),
        Livro(
            id = "DOM001",
            titulo = "Dom Casmurro",
            autor = "Machado de Assis",
            capaUrl = "https://covers.openlibrary.org/b/id/10558903-L.jpg",
            descricao = null,
            anoPublicacao = 2002,
            paginas = null,
            idioma = "Português"
        ),

        Livro(
            id = "TOR001",
            titulo = "Torto Arado",
            autor = "Itamar Vieira Junior\n",
            capaUrl = "https://covers.openlibrary.org/b/id/12369648-L.jpg",
            descricao = null,
            anoPublicacao = 2019,
            paginas = null,
            idioma = "Português"
        )
    )

    val livrosLidosFake = listOf(

        Livro(
            id = "DIA001",
            titulo = "Diário de um banana",
            autor = "Jeff Kinney",
            capaUrl = "https://covers.openlibrary.org/b/id/12390997-L.jpg",
            descricao = null,
            anoPublicacao = 2008,
            paginas = null,
            idioma = "Português"
        ),

        Livro(
            id = "VID001",
            titulo = "Vidas Secas",
            autor = "Graciliano Ramos",
            capaUrl = "https://covers.openlibrary.org/b/id/14603084-L.jpg",
            descricao = null,
            anoPublicacao = 2024,
            paginas = null,
            idioma = "Português"
        )
    )

//    val livrosLidos by estanteViewModel.lidos.collectAsState()

    val idUsuarioLogado = UserSession.usuario?.id ?: return

    val lifecycleOwner = LocalLifecycleOwner.current

//    LaunchedEffect(Unit) {
//        estanteViewModel.carregarEstante(idUsuarioLogado)
//    }

    Scaffold(
        bottomBar = {
            BottomBar(navController = navController)
        }
    ) { paddingValues ->

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

            if (busca.isBlank()) {

                item {
                    Text(
                        text = "Resumo",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.onBackground
                    )
                }

                item {
                    SecaoResumoEstante()
                }

                if (livrosLendoFake.isNotEmpty()) {
                    item {
                        Text(
                            text = "Lendo atualmente",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    item {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(livrosLendoFake) { livro ->
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

                if (livrosQueroLerFake.isNotEmpty()) {
                    item {
                        Text(
                            text = "Quero Ler",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    item {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(livrosQueroLerFake) { livro ->
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

                if (livrosLidosFake.isNotEmpty()) {
                    item {
                        Text(
                            text = "Lidos",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    item {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(livrosLidosFake) { livro ->
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

            } else {

                items(livrosBusca) { livro ->
                    LivroCard(
                        capaUrl = livro.capaUrl,
                        titulo = livro.titulo,
                        autor = livro.autor,
                        ano = livro.anoPublicacao,
                        onClick = {
                            livroViewModel.selecionarLivro(livro)
                            navController.navigate(
                                "detalhes_livro/${Uri.encode(livro.id)}"
                            )
                        }
                    )
                }

            }
        }
    }
}