package com.example.conectabook.components

// Arquivo responsável pela criação do header do aplicativo

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Menu
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

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(80.dp)
            .background(colors.primary)
            .padding(horizontal = 20.dp),
        contentAlignment = Alignment.Center

    ) {
        if (mostrarVoltar) {
            IconButton(
                onClick = onVoltarClick,
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Outlined.ArrowBack,
                    contentDescription = "Voltar",
                    tint = colors.onPrimary
                )
            }
        } else {
            IconButton(
                onClick = {},
                modifier = Modifier.align(Alignment.CenterStart)
            ) {
                Icon(
                    imageVector = Icons.Outlined.Menu,
                    contentDescription = "Menu",
                    tint = colors.onPrimary
                )
            }
        }

        Text(
            text = titulo ?: "",
            fontSize = 20.sp,
            color = colors.onPrimary,
            fontWeight = FontWeight.Bold
        )

//        if (mostrarAvatar) {
//            Image(
//                painter = painterResource(id = R.drawable.perfil_lendo),
//                contentDescription = "Foto do usuário",
//                modifier = Modifier
//                    .size(44.dp)
//                    .clip(CircleShape)
//                    .background(colors.surface)
//                    .align(Alignment.CenterEnd)
//            )
//        }

        Icon(
            imageVector = Icons.Outlined.Notifications,
            contentDescription = "Notificações",
            tint = colors.onPrimary,
            modifier = Modifier.size(26.dp)
                .align(Alignment.CenterEnd)
        )
    }
}