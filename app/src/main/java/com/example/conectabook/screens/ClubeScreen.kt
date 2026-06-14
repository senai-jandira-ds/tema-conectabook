package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.ClubeCard
import com.example.conectabook.components.SearchBarClubes
import com.example.conectabook.data.api.model.ClubeListaUi
import com.example.conectabook.navigation.Routes
import com.example.conectabook.viewmodel.ClubesViewModel

@Composable
fun ClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    val viewModel: ClubesViewModel = viewModel()

    fun feedClubeRoute(id: Int) =
        "feed_clube/$id"

    val clubes by viewModel.clubes.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.carregarClubes()
    }

    var busca by remember { mutableStateOf("") }

    val clubesUi = clubes.map {

        ClubeListaUi(
            id = it.id_clube,
            nome = it.nome,
            descricao = it.sobre,
            imagemUrl = it.foto,
            genero = it.genero,
            totalMembros = it.total_membros,
            participando = false,
            admin = false
        )
    }

    //    val clubes = clubesFixos + ClubeRepository.clubes

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
                mostrarVoltar = false,
                mostrarAvatar = false
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

            items(clubesUi) { clube ->

                ClubeCard(
                    clube = clube,
                    onParticiparClick = {
                        navController.navigate("feed_clube/${clube.id}")
                    },
                    onCardClick = {
                    }
                )
            }

            }
        }
    }
}