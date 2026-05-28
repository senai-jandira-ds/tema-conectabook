package com.example.conectabook.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.AddCircle
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SearchBarClubes(
    busca: String,
    onBuscaChange: (String) -> Unit,
    onCriarClubeClick: () -> Unit,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {

        OutlinedTextField(
            value = busca,
            onValueChange = onBuscaChange,
            modifier = Modifier
                .weight(1f)
                .height(52.dp),
            placeholder = {
                Text("Procurar clubes...")
            },
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            leadingIcon = {
                Icon(
                    imageVector = Icons.Outlined.Search,
                    contentDescription = "Lupa de pesquisa",
                    tint = colors.onSurfaceVariant,
                    modifier = Modifier.size(20.dp)
                )
            },
//            colors = OutlinedTextFieldDefaults.colors(
//                focusedBorderColor = colors.outline.copy(alpha = 0.4f),
//                unfocusedBorderColor = colors.outline.copy(alpha = 0.25f)
//            )
        )

        Button(
            onClick = onCriarClubeClick,
            modifier = Modifier.height(52.dp),
            shape = RoundedCornerShape(14.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.primary
            )
        ) {
            Icon(
                imageVector = Icons.Outlined.AddCircle,
                contentDescription = "Criar clube",
                modifier = Modifier.size(18.dp)
            )

            Text(
                text = "Criar Clube"
            )
        }
    }


    
}