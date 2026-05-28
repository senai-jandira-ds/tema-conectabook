package com.example.conectabook.screens

import android.net.Uri

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.conectabook.components.FotoClubePicker

@Composable
fun CriarClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    var imagemUri by remember { mutableStateOf<Uri?>(null) }

    FotoClubePicker(
        imagemUri = imagemUri,
        onImagemSelecionada = {
            imagemUri = it
        }
    )
}