package com.example.conectabook.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.People
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.conectabook.R

@Composable
fun ClubeHeader(
    nome: String,
    genero: String,
    totalMembros: Int,
    fotoUrl: String?,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {

        AsyncImage(
            model = fotoUrl,
                    contentDescription = nome,
            modifier = Modifier
                .size(96.dp)
                .clip(CircleShape)
        )

        Column(
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {

            Text(
                text = "Clube dos Lobos",
                style = MaterialTheme.typography.titleLarge
            )

            Text(
                text = "1.250 membros",
                style = MaterialTheme.typography.bodyMedium
            )

            Text(
                text = "Fantasia",
                style = MaterialTheme.typography.bodySmall
            )
        }
    }

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {

        Button(
            onClick = {}
        ) {
            Icon(
                imageVector = Icons.Outlined.Edit,
                contentDescription = null,
                tint = colors.onPrimary,
                modifier = Modifier.size(20.dp)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text("Editar Clube")
        }

        OutlinedButton(
            onClick = {}
        ) {
            Icon(
                imageVector = Icons.Outlined.People,
                contentDescription = null,
                tint = colors.onPrimary,
                modifier = Modifier.size(20.dp)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text("Membros")
        }
    }
    
}