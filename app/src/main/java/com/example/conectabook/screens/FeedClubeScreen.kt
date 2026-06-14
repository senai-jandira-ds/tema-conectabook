package com.example.conectabook.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.conectabook.components.ClubeHeader
import com.example.conectabook.components.CriarPostcard
import com.example.conectabook.components.PostCard
import com.example.conectabook.components.PostClubeCard
import com.example.conectabook.viewmodel.ClubesViewModel
import com.example.conectabook.viewmodel.MensagemViewModel

@Composable
fun FeedClubeScreen(
    modifier: Modifier = Modifier,
    clubeId: Int,
    viewModel: MensagemViewModel = viewModel()
) {

    val colors = MaterialTheme.colorScheme

    val clubeViewModel: ClubesViewModel = viewModel()

    val clubes by clubeViewModel.clubes.collectAsState()

    val mensagens by viewModel.mensagens.collectAsState()

    LaunchedEffect(clubeId) {
        viewModel.carregarMensagens()
        clubeViewModel.carregarClubes()
    }


    val clube = clubes.find {
        it.id_clube == clubeId
    }

    if (clube == null) {
        Text("Carregando...")
        return
    }

    val postsDoClube =
        mensagens.filter {
            it.id_clube == clubeId
        }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(
            start = 24.dp,
            end = 24.dp,
            top = 24.dp,
            bottom = 100.dp
        )
    ) {

        // Header do clube
        item {
            ClubeHeader(
                nome = clube.nome,
                genero = clube.genero,
                totalMembros = clube.total_membros,
                fotoUrl = clube.foto
            )
        }

        // Card para criar postagem
        item {
            CriarPostcard()
        }

        // Divisor visual
        item {
            Text(
                text = "Discussões recentes",
                style = MaterialTheme.typography.titleMedium
            )
        }

        // Lista de posts
        items(postsDoClube) { post ->

            PostClubeCard(
                nomeUsuario = "Usuário",
                comentario = post.comentario ?: "",
                imagemUrl = post.arquivo,
                data = post.data_postagem
            )
        }
    }
}