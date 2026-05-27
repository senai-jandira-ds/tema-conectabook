package com.example.conectabook.components

// Arquivo responsável pela criação do header do aplicativo

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.conectabook.R

@Composable
fun AppHeader(
    titulo: String?= null,
    subtitulo: String? = null, // o simbolo "?" significa que a string é opcional, nem toda tela precisa ter
    mostrarAvatar: Boolean = true,
    mostrarVoltar: Boolean = false,
    mostrarNotificacao: Boolean = false,
    onVoltarClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.colorScheme

    Row(
        modifier = Modifier
            .fillMaxWidth()
//            .clip(
//                RoundedCornerShape(
//                    bottomStart = 24.dp,
//                    bottomEnd = 24.dp
//                )
//            )
            .background(colors.primary)
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (mostrarVoltar) {
            IconButton(
                onClick = onVoltarClick
            ) {
                Icon(
                    imageVector = Icons.Outlined.ArrowBack,
                    contentDescription = "Voltar",
                    tint = colors.onPrimary
                )
            }

            Spacer(modifier = Modifier.width(8.dp))
        }

        Column(
            modifier = Modifier
                .weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            titulo?.let {
                if (it.isNotBlank()) {
                    Text(
                        text = it,
                        fontSize = 20.sp,
                        color = colors.onPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }


        if (mostrarNotificacao) {
            IconButton(onClick = {}) {
                Icon(
                    imageVector = Icons.Outlined.Notifications,
                    contentDescription = "Icone de notificaçõs",
                    tint = colors.onPrimary
                )
            }
        }


        if (mostrarAvatar) {
            Image(
                painter = painterResource(id = R.drawable.moca_lendo),
                contentDescription = "Foto do usuário",
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(colors.surface)
            )
        }
    }
}