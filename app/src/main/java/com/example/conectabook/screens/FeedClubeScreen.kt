package com.example.conectabook.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.rememberAsyncImagePainter
import com.example.conectabook.components.*
import com.example.conectabook.viewmodel.ClubesViewModel
import com.example.conectabook.viewmodel.MensagemViewModel
import com.example.conectabook.viewmodel.UsuarioViewModel
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun FeedClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier,
    clubeId: Int,
    viewModel: MensagemViewModel = viewModel()
) {

    val colors = MaterialTheme.colorScheme

    val clubeViewModel: ClubesViewModel = viewModel()
    val usuarioViewModel: UsuarioViewModel = viewModel()

    val clubes by clubeViewModel.clubes.collectAsState()
    val mensagens by viewModel.mensagens.collectAsState()
    val usuariosCache by usuarioViewModel.usuariosCache.collectAsState()

    // 🔥 estado de likes correto (POR POST)
    val likesMap = remember { mutableStateMapOf<Int, Boolean>() }
    val countMap = remember { mutableStateMapOf<Int, Int>() }

    fun formatarData(dataIso: String): String {
        return try {
            val data = ZonedDateTime.parse(dataIso)
            val formatter = DateTimeFormatter.ofPattern(
                "dd/MM/yyyy HH:mm",
                Locale("pt", "BR")
            )
            data.format(formatter)
        } catch (e: Exception) {
            dataIso
        }
    }

    fun carregarUsuario(id: Int) {
        if (!usuariosCache.containsKey(id)) {
            usuarioViewModel.buscarUsuarioPorId(id)
        }
    }

    LaunchedEffect(clubeId) {
        viewModel.carregarMensagens()
        clubeViewModel.carregarClubes()
    }

    val clube = clubes.find { it.id_clube == clubeId }

    if (clube == null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    val postsDoClube = mensagens.filter { it.id_clube == clubeId }

    Scaffold(
        bottomBar = { BottomBar(navController = navController) }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(colors.primary)
                .padding(paddingValues)
        ) {

            AppHeader(
                titulo = "",
                mostrarVoltar = true,
                mostrarAvatar = false
            )

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                    .background(Color(0xFFF8FAFC))
                    .padding(horizontal = 24.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp),
                contentPadding = PaddingValues(top = 20.dp, bottom = 24.dp)
            ) {

                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp)
                    ) {

                        Image(
                            painter = rememberAsyncImagePainter(clube.foto),
                            contentDescription = null,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp),
                            contentScale = ContentScale.Crop
                        )

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 140.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            ),
                            elevation = CardDefaults.cardElevation(6.dp)
                        ) {

                            Column(Modifier.padding(16.dp)) {

                                Row(verticalAlignment = Alignment.CenterVertically) {

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
                                        Text(clube.nome, style = MaterialTheme.typography.titleLarge)
                                        Text("${clube.total_membros} membros • ${clube.genero}")
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Button(onClick = {}) { Text("Editar Clube") }
                                    OutlinedButton(onClick = {}) { Text("Membros") }
                                }
                            }
                        }
                    }
                }

                item {
                    CriarPostcard(
                        clubeId = clubeId,
                        usuarioId = 31,
                        onPostCriado = {
                            viewModel.carregarMensagens()
                        }
                    )
                }

                item {
                    Text(
                        text = "Discussões recentes",
                        style = MaterialTheme.typography.titleMedium
                    )
                }

                items(
                    items = postsDoClube,
                    key = { it.id_mensagem }
                ) { post ->

                    val usuario = usuariosCache[post.id_usuario]

                    if (usuario == null) {
                        carregarUsuario(post.id_usuario)
                    }

                    val curtido = likesMap[post.id_mensagem] ?: false
                    val likes = countMap[post.id_mensagem] ?: 0

                    PostClubeCard(
                        idMensagem = post.id_mensagem,
                        nomeUsuario = usuario?.nome_usuario ?: "Carregando...",
                        comentario = post.comentario ?: "",
                        imagemUrl = post.arquivo,
                        data = formatarData(post.data_postagem),
                        curtido = curtido,
                        likes = likes,
                        onLikeClick = {
                            val novoEstado = !curtido
                            likesMap[post.id_mensagem] = novoEstado

                            countMap[post.id_mensagem] =
                                if (novoEstado) likes + 1 else likes - 1
                        }
                    )
                }
            }
        }
    }
}