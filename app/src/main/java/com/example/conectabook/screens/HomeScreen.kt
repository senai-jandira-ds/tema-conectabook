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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.conectabook.R
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.CriarPostcard
import com.example.conectabook.components.HomeaHeader
import com.example.conectabook.components.PostCard
import com.example.conectabook.components.SecaoClubes
import com.example.conectabook.components.SecaoTitulosSugeridos

@Composable
fun HomeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    Scaffold(
        bottomBar = {
            BottomBar(navController = navController)
        }
    ) { paddingValues ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(colors.background)
                .padding(paddingValues)
                .padding(horizontal = 24.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(24.dp))
            }

            item {
                HomeaHeader()
            }

            item {
                CriarPostcard(

                )
            }

            item {
                SecaoTitulosSugeridos()
            }

            item {
                SecaoClubes()
            }

            item {
                PostCard(
                    nome = "Raissa Soares",
                    tempo = "2h atrás",
                    texto = "Acabei de terminar 1984, do George Orwell, e estou simplesmente impactado.\n" +
                            "A forma como o livro mostra um mundo controlado pelo governo, onde até os pensamentos são monitorados, é assustadoramente atual. " +
                            "Durante a leitura fiquei me perguntando várias vezes até que ponto nossa própria sociedade poderia caminhar para algo parecido.",
                    curtidas = 128,
                    comentarios = 32,
                    avatar = R.drawable.moca_lendo,
                    capaLivro = R.drawable.livropost,
                    nomeLivro = "1984",
                    autorLivro = "George Orwell",
                    notaLivro = "4.9"
                )
            }
        }
    }

}