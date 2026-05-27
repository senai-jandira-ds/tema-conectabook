package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.conectabook.R
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.ClubeCard
import com.example.conectabook.data.api.model.ClubeListaUi

@Composable
fun ClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    val clubes = listOf(
        ClubeListaUi(
            id = 1,
            nome = "Harry Potter",
            descricao = "Clube do Livro de Hogwarts: Um espaço mágico para debater as teorias, mistérios e lições do universo de Harry Potter. " +
                    "Prepare sua varinha, traga seu livro favorito e venha compartilhar sua paixão pelo Mundo Bruxo com outros membros da sua casa!",
            imagem = R.drawable.clubebruxos,
            genero = "Ficção",
            totalMembros = 270,
            participando = false,
            admin = false
        )
    )

    Scaffold(
        bottomBar = { BottomBar(navController = navController)}
    ) { paddingValues ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8FAFC))
                .padding(paddingValues)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {

            item {
                AppHeader(
                    titulo = "",
                    mostrarAvatar = true,
                    mostrarVoltar = true
                )
            }

            items(clubes) { clube ->
                ClubeCard(
                    clube = clube,
                    onParticiparClick = {},
//                    modifier = Modifier.padding(horizontal = 24.dp)
                )
            }
        }
    }
}