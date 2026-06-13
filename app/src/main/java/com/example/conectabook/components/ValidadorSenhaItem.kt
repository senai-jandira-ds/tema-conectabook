package com.example.conectabook.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ValidadorSenhaItem(
    valido: Boolean,
    texto: String
) {
    val cor = if (valido) Color(0xFF16A34A) else MaterialTheme.colorScheme.error

    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            modifier = Modifier
                .padding(end = 6.dp),
            text = if (valido) "✔" else "✖",
            color = cor,
            fontSize = 14.sp
        )

        Text(
            text = texto,
            color = cor,
            fontSize = 12.sp
        )
    }
}