package com.example.conectabook.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.rememberAsyncImagePainter
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.ClubeHeader
import com.example.conectabook.components.CriarPostcard
import com.example.conectabook.components.PostCard
import com.example.conectabook.components.PostClubeCard
import com.example.conectabook.viewmodel.ClubesViewModel
import com.example.conectabook.viewmodel.MensagemViewModel

@Composable
fun FeedClubeScreen(
    navController: NavController,
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

    Scaffold(
        topBar = {
            AppHeader(
                titulo = "",
                mostrarVoltar = true,
                mostrarAvatar = false,
                onVoltarClick = {navController.popBackStack()}
            )
        }
    ) { padding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(
                start = 16.dp,
                end = 16.dp,
                top = 16.dp,
                bottom = 100.dp
            ),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {

        // Header do clube
            item {

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {

                    // Banner
                    Image(
                        painter = rememberAsyncImagePainter(clube.foto),
                        contentDescription = null,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp),
                        contentScale = ContentScale.Crop
                    )

                    // Card branco por cima
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 140.dp),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    ) {

                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {

                            Row(
                                verticalAlignment = Alignment.CenterVertically
                            ) {

                                Image(
                                    painter = rememberAsyncImagePainter(clube.foto),
                                    contentDescription = null,
                                    modifier = Modifier
                                        .size(72.dp)
                                        .clip(CircleShape),
                                    contentScale = ContentScale.Crop
                                )

                                Spacer(modifier = Modifier.width(12.dp))

                            Column {

                                Text(
                                    text = clube.nome,
                                    style = MaterialTheme.typography.titleLarge
                                )

                                Text(
                                    text = "${clube.total_membros} membros • ${clube.genero}",
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                                }

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Button(onClick = {}) {
                                    Text("Editar Clube")
                                }

                                OutlinedButton(onClick = {}) {
                                    Text("Membros")
                                }
                            }
                        }
                    }
                }
            }

        // Card para criar postagem
        item {
            androidx.compose.material3.Card(
                colors = androidx.compose.material3.CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            ) {
                CriarPostcard()
            }
        }

        // Divisor visual
        item {
            Text(
                text = "Discussões recentes",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
            )
        }

        // Lista de posts
        items(postsDoClube) { post ->

            PostClubeCard(
                modifier = Modifier
                    .padding(12.dp),
                nomeUsuario = "Usuário",
                comentario = post.comentario ?: "",
                imagemUrl = post.arquivo,
                data = post.data_postagem
            )
        }
        }
    }
}