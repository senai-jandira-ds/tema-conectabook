package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.DetalhesLivroHeader
import com.example.conectabook.components.SecaoComunidadeLivro
import com.example.conectabook.components.SecaoHeroLivro
import com.example.conectabook.components.SecaoLivrosSemelhantes
import com.example.conectabook.components.SecaoTitulosSugeridos
import com.example.conectabook.components.SobreLivroCard
import com.example.conectabook.viewmodel.LivroViewModel

@Composable
fun DetalhesLivroScreen(
    navController: NavController,
    livroId: String,
    modifier: Modifier = Modifier) {

    val viewModel: LivroViewModel = viewModel()
    val livro by viewModel.livroSelecionado.collectAsState()

    var mostrarDialog by remember {
        mutableStateOf(false)
    }

    LaunchedEffect(livroId) {
        viewModel.buscarLivroPorId(livroId)
    }

        Scaffold(
        bottomBar = { BottomBar(navController = navController) }
    ) { paddingValues ->

            if (livro == null) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Carregando...")
                }
                return@Scaffold
            }

            val livroAtual = livro!!

            LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8FAFC))
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(28.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {

            item {
                DetalhesLivroHeader(
                    onVoltarClick = {navController.popBackStack()}
                )
            }

            item {
                SecaoHeroLivro(
                    titulo = livroAtual.titulo,
                    autor = livroAtual.autor,
                    capaUrl = livroAtual.capaUrl,
                    ano = livroAtual.anoPublicacao,
                    onAdicionarEstante = { status ->

                        viewModel.adicionarNaEstante(
                            livroId = livroId,
                            status = status
                        )
                    }
                )
            }

            item {
                SobreLivroCard(
                    modifier = Modifier.padding(horizontal = 24.dp)
                )
            }

            item {
                SecaoComunidadeLivro(
                    modifier = Modifier.padding(horizontal = 24.dp)
                )
            }

            item {
                SecaoLivrosSemelhantes(
                    modifier = Modifier.padding(horizontal = 24.dp)
                )

            }
        }
    }
}