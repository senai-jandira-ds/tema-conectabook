package com.example.conectabook.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class LivroEstanteUi(
    val capa: Int,
    val titulo: String,
    val autor: String,
    val nota: String
)

@Composable
fun SecaoLivrosEstante(
    titulo: String,
    livros: List<LivroEstanteUi>,
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.colorScheme

    Column(modifier = modifier.fillMaxWidth()) {

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = titulo,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground
            )

            Text(
                text = "Ver todos",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = colors.primary,
                modifier = Modifier.clickable{}
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
//           /
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(livros) { livro ->

                LivroCard(
                    capa = livro.capa,
                    titulo = livro.titulo,
                    autor = livro.autor,
                    nota = livro.nota
                )
            }
        }
    }
}