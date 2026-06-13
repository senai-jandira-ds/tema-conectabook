package com.example.conectabook.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Book
import androidx.compose.material.icons.outlined.Bookmark
import androidx.compose.material.icons.outlined.MenuBook
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SecaoResumoEstante() {

    val colors = MaterialTheme.colorScheme

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        ),
        elevation = CardDefaults.cardElevation(6.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            ResumoEstanteCard(
                icon = Icons.Outlined.Book,
                titulo = "Lidos",
                quantidade = 12,
                modifier = Modifier.weight(1f)
            )

            ResumoEstanteCard(
                icon = Icons.Outlined.MenuBook,
                titulo = "Lendo",
                quantidade = 5,
                modifier = Modifier.weight(1f)
            )

            ResumoEstanteCard(
                icon = Icons.Outlined.Bookmark,
                titulo = "Quero ler",
                quantidade = 18,
                modifier = Modifier.weight(1f)
            )
        }
    }
}