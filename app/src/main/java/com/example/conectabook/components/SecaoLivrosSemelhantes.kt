package com.example.conectabook.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.example.conectabook.R
import kotlin.collections.map

@Composable
fun SecaoLivrosSemelhantes(modifier: Modifier = Modifier) {

    val livros = listOf(
        LivroEstanteUi(R.drawable.diariobanana, "A Revolução dos Bichos", "George Orwell", "4,7"),
        LivroEstanteUi(R.drawable.diariobanana, "Admirável Mundo Novo", "Aldous Huxley", "4,6"),
        LivroEstanteUi(R.drawable.diariobanana, "Fahrenheit 451", "Ray Bradbury", "4,8")
    )

    SecaoLivrosEstante(
        titulo = "Livros Semelhantes",
        livros = livros,
        modifier = Modifier

    )
}
