package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Book
import androidx.compose.material.icons.outlined.Bookmark
import androidx.compose.material.icons.outlined.MenuBook
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
import androidx.navigation.NavController
import com.example.conectabook.R
import com.example.conectabook.components.LivroEstanteUi
import com.example.conectabook.components.ResumoEstanteCard
import com.example.conectabook.components.SecaoLivrosEstante
import com.example.conectabook.components.SecaoResumoEstante

@Composable
fun LivrosScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme
    var busca by remember { mutableStateOf("") }

    val livrosLidos = listOf(
        LivroEstanteUi(
            capa = R.drawable.diariobanana,
            titulo = "O Pequeno Príncipe",
            autor = "Antoine de Saint-Exupéry",
            nota = "4,8"
        ),
        LivroEstanteUi(
            capa = R.drawable.diariobanana,
            titulo = "A Revolução dos Bichos",
            autor = "George Orwell",
            nota = "4,6"
        ),
        LivroEstanteUi(
            capa = R.drawable.quemqueijo,
            titulo = "Quem Mexeu no Meu Queijo?",
            autor = "Spencer Johnson",
            nota = "4,8"
        )

    )

    val livrosLendo = listOf(
        LivroEstanteUi(
            capa = R.drawable.diariobanana,
            titulo = "A Cabana",
            autor = "William P. Young",
            nota = "4,9"
        ),

        LivroEstanteUi(
            capa = R.drawable.sopaletrinhas,
            titulo = "A Cabana",
            autor = "William P. Young",
            nota = "4,9"
    )
    )

    val livrosQueroLer = listOf(
        LivroEstanteUi(
            capa = R.drawable.diariobanana,
            titulo = "Lady Killers",
            autor = "Tori Telfer",
            nota = "4,8"
        )
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
                    onBuscaChange = {busca = it},
                    onCameraClick = {
                    }
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

            item {
                SecaoLivrosEstante(
                    titulo = "Lidos",
                    livros = livrosLidos
                )
            }

            item {
                SecaoLivrosEstante(
                    titulo = "Lendo",
                    livros = livrosLendo
                )
            }

            item {
                SecaoLivrosEstante(
                    titulo = "Quero ler",
                    livros = livrosQueroLer
                )
            }

        }
    }
}