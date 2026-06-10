package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.example.conectabook.R
import com.example.conectabook.components.LivroEstanteUi
import com.example.conectabook.components.SecaoLivrosEstante
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

    val livros = viewModel.livros


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
//                Text(
//                    text = livro.title,
//                    style = MaterialTheme.typography.titleMedium
//                )
//
//                Text(
//                    text = livro.author_name?.firstOrNull() ?: "Autor desconhecido"
//                )

        }
    }
}