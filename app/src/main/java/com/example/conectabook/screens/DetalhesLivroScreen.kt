package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.SecaoComunidadeLivro
import com.example.conectabook.components.SecaoHeroLivro
import com.example.conectabook.components.SecaoLivrosSemelhantes
import com.example.conectabook.components.SecaoTitulosSugeridos
import com.example.conectabook.components.SobreLivroCard

@Composable
fun DetalhesLivroScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    Scaffold(
        bottomBar = { BottomBar(navController = navController) }
    ) { paddingValues ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8FAFC))
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(28.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {

            item {
            AppHeader(
                titulo = "detalhes do livro",
                mostrarVoltar = true,
                mostrarAvatar = true
                )
            }

            item {
            SecaoHeroLivro(
                modifier = Modifier.padding(horizontal = 24.dp)
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