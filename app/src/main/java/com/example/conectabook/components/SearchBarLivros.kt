package com.example.conectabook.components

import android.R.attr.singleLine
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SearchBarLivros(
    busca: String,
    onBuscaChange: (String) -> Unit,
    onCameraClick: () -> Unit
) {
    val colors = MaterialTheme.colorScheme

        OutlinedTextField(
            value = busca,
            onValueChange = onBuscaChange,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 16.dp)
            .height(52.dp),
            placeholder = {
                Text("Buscar por nome, autor ou ISBN...")
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Outlined.Search,
                    contentDescription = "Lupa de pesquisa",
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(20.dp)
                )
            },

    trailingIcon = {
        IconButton(onClick = onCameraClick) {
            Icon(
                imageVector = Icons.Outlined.CameraAlt,
                contentDescription = "Icone câmera",
                tint = colors.onSurfaceVariant,
                modifier = Modifier.size(20.dp)
            )
        }
    },
        singleLine = true,
        shape = RoundedCornerShape(16.dp)
    )
}

