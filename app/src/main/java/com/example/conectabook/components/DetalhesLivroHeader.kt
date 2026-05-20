package com.example.conectabook.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.MoreVert
import androidx.compose.material3.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp

@Composable
fun DetalhesLivroHeader(
    onVoltarClick: () -> Unit,
    modifier: Modifier = Modifier) {

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onVoltarClick) {
            Icon(
                imageVector = Icons.Outlined.ArrowBack,
                contentDescription = "Voltar",
                tint = MaterialTheme.colorScheme.onBackground
            )
        }

//        Spacer(modifier = Modifier.weight(1f))
//
//        IconButton(onClick = {}) {
//            Icon(
//                imageVector = Icons.Outlined.FavoriteBorder,
//                contentDescription = "Favoritar",
//                tint = MaterialTheme.colorScheme.onBackground
//            )
//        }
//
//        IconButton(onClick = {}) {
//            Icon(
//                imageVector = Icons.Outlined.MoreVert,
//                contentDescription = "Mais opções",
//                tint = MaterialTheme.colorScheme.onBackground
//            )
//        }
    }
}