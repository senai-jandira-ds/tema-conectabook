package com.example.conectabook.components

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
import com.example.conectabook.R
import com.example.conectabook.data.api.model.Livro

@Composable
fun SecaoTitulosSugeridos(
    livros: List<Livro>,
    modifier: Modifier = Modifier
) {

    val colors = MaterialTheme.colorScheme

    Column(modifier = Modifier
        .fillMaxWidth()) {

        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Titulos sugeridos",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground
            )

            Text(
                text = "Ver todos",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = colors.primary
            )
        }
    }

    Spacer(modifier = Modifier.height(12.dp))

    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(12.dp)

    ) {
        items(livros) { livro ->

            LivroCard(
                capaUrl = livro.capaUrl,
                titulo = livro.titulo,
                autor = livro.autor,
                ano = livro.anoPublicacao,
                onClick = {}
            )
        }
    }
}