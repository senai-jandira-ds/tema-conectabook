package com.example.conectabook.components

import androidx.compose.material3.Icon
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.MenuBook
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SobreLivroCard(modifier: Modifier = Modifier) {
    
    val colors = MaterialTheme.colorScheme

    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        ),
        elevation = CardDefaults.cardElevation(3.dp),
        shape = RoundedCornerShape(20.dp)
    ) {
        
    Column(
        modifier = Modifier.padding(24.dp)
    ) {
        Text(
            text = "Sobre o livro",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = colors.onBackground
        )

        Spacer(modifier = Modifier.height(20.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            InfoLivroItem(
                icon = Icons.Outlined.CalendarMonth,
                titulo = "Publicado",
                valor = "1949"
            )

            InfoLivroItem(
                icon = Icons.Outlined.MenuBook,
                titulo = "Páginas",
                valor = "328"
            )

            InfoLivroItem(
                icon = Icons.Outlined.Language,
                titulo = "Idioma",
                valor = "PT-BR"
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        HorizontalDivider(
            thickness = 1.dp,
            color = colors.outline.copy(alpha = 0.2f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Em um futuro distópico, Winston Smith vive sob vigilância constante de um regime totalitário liderado pelo Grande Irmão. Ao desafiar esse sistema, ele descobre os limites da liberdade, da verdade e da própria humanidade.",
            fontSize = 15.sp,
            lineHeight = 26.sp,
            color = colors.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "Ver mais",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = colors.primary
        )
        }
    }
}

@Composable
fun InfoLivroItem(
    icon: ImageVector,
    titulo: String,
    valor: String
) {
    val colors = MaterialTheme.colorScheme

    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = titulo,
            tint = colors.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = titulo,
            fontSize = 12.sp,
            color = colors.onSurfaceVariant
        )

        Text(
            text = valor,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = colors.onBackground
        )
    }
}