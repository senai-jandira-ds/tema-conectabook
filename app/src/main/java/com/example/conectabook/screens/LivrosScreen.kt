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
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.conectabook.components.LivroCard
import com.example.conectabook.components.SecaoResumoEstante
import com.example.conectabook.navigation.Routes
import com.example.conectabook.viewmodel.LivroViewModel

@Composable
fun LivrosScreen(
    navController: NavController,
    modifier: Modifier = Modifier,
    viewModel: LivroViewModel = viewModel()
) {

    val colors = MaterialTheme.colorScheme
    var busca by remember { mutableStateOf("") }

    val livros by viewModel.livros.collectAsState()


    val livrosLendo = listOf(
        "1984",
        "O Hobbit"
    )

    val livrosQueroLer = listOf(
        "Duna",
        "Neuromancer",
        "Percy Jackson"
    )


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
                            viewModel.buscarLivros(it)
                        }
                                    },
                    onCameraClick = {}
                )
            }

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

            if (busca.isBlank()) {

                item {

                    Text(
                        text = "Lendo",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                items(livrosLendo) { livro ->

                    Text(
                        text = livro,
                        fontSize = 16.sp,
                        color = colors.onBackground
                    )
                }

                item {

                    Text(
                        text = "Quero Ler",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                items(livrosQueroLer) { livro ->

                    Text(
                        text = livro,
                        fontSize = 16.sp,
                        color = colors.onBackground
                    )
                }
            }
            else {

                items(livros) { livro ->

                    LivroCard(
                        capaUrl = livro.capaUrl,
                        titulo = livro.titulo,
                        autor = livro.autor,
                        ano = livro.anoPublicacao,
                        onClick = {

                            viewModel.selecionarLivro(livro)

                            navController.navigate("detalhes_livro/${Uri.encode(livro.id)}")

                        }
                    )
                }
            }
        }
    }
}