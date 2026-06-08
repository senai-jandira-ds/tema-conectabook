package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.conectabook.R
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.ClubeCard
import com.example.conectabook.components.SearchBarClubes
import com.example.conectabook.data.api.model.ClubeListaUi
import com.example.conectabook.navigation.Routes

@Composable
fun ClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    var busca by remember { mutableStateOf("") }

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
        ),

        ClubeListaUi(
            id = 2,
            nome = "Clube dos Lobos",
            descricao = "Um espaço para revisitar a saga que marcou uma geração. Venha discutir os mistérios de Forks, debater as escolhas de Bella e reviver a eterna rivalidade entre vampiros e lobisomens. " +
                    "Pegue seu casaco de frio, prepare o seu coração de fã e junte-se a nós para reler (ou ler pela primeira vez) o romance sobrenatural mais icônico dos anos 2000!",
            imagem = R.drawable.clubelobo,
            genero = "Ficção",
            totalMembros = 1752,
            participando = true,
            admin = false
        ),

        ClubeListaUi(
            id = 1,
            nome = "Semideuses & Bruxos",
            descricao = "O ponto de encontro oficial dos filhos dos deuses (e agregados). Leituras coletivas, debates mitológicos e muito humor azul. " +
                    "Venha descobrir de qual chalé você é e debater as sagas do Rick Riordan com a gente. Não olhe para a Medusa e entre no bando!",
            imagem = R.drawable.clubemar,
            genero = "Ficção",
            totalMembros = 270,
            participando = false,
            admin = false
        )
    )

    Scaffold(
        bottomBar = { BottomBar(navController = navController)}
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(colors.primary)
                .padding(paddingValues)
        ) {
            AppHeader(
                titulo = "Clubes",
                mostrarVoltar = true,
                mostrarAvatar = true
            )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .clip(
                    RoundedCornerShape(
                        topStart = 24.dp,
                        topEnd = 24.dp
                    )
                )
                .background(Color(0xFFF8FAFC))
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
            contentPadding = PaddingValues(top = 20.dp, bottom = 24.dp)
        ) {

            item {
                SearchBarClubes(
                    busca = busca,
                    onBuscaChange = {busca = it},
                    onCriarClubeClick = {
                        navController.navigate(Routes.CRIAR_CLUBE)
                    }
                )
            }

            items(clubes) { clube ->
                ClubeCard(
                    clube = clube,
                    onParticiparClick = {},
                    onCardClick = {}
                    )
                }
            }
        }
    }
}