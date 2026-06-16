package com.example.conectabook.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.conectabook.data.api.model.Cafeteria

@Composable
fun CafeteriaCard(cafeteria: Cafeteria) {

    Card(
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(6.dp),
        modifier = Modifier.fillMaxWidth()
    ) {

        Column {

            cafeteria.imagemUrl?.let {
                Image(
                    painter = rememberAsyncImagePainter(it),
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp),
                    contentScale = ContentScale.Crop
                )
            }

            Column(modifier = Modifier.padding(12.dp)) {

                Text(
                    cafeteria.nome,
                    style = MaterialTheme.typography.titleMedium
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    cafeteria.descricao,
                    style = MaterialTheme.typography.bodySmall
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {

                    if (cafeteria.wifi) {
                        AssistChip(onClick = {}, label = { Text("Wi-Fi") })
                    }

                    if (cafeteria.silencio) {
                        AssistChip(onClick = {}, label = { Text("Silenciosa") })
                    }

                    AssistChip(onClick = {}, label = { Text("⭐ ${cafeteria.avaliacao}") })
                }
            }
        }
    }
}