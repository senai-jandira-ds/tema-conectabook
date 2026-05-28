package com.example.conectabook.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import coil.compose.rememberAsyncImagePainter



@Composable
fun FotoClubePicker(
    imagemUri: Uri?,
    onImagemSelecionada: (Uri?) -> Unit,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    val galeriaLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) {  uri ->
        onImagemSelecionada(uri)
    }

    Box(
        modifier = Modifier
            .size(140.dp)
            .clip(CircleShape)
            .background(colors.surfaceVariant)
            .clickable{
                galeriaLauncher.launch("image/*")
            },
        contentAlignment = Alignment.Center
    ) {
      if (imagemUri !=null) {
          Image(
              painter = rememberAsyncImagePainter (imagemUri),
              contentDescription = "Foto do clube",
              contentScale = ContentScale.Crop,
              modifier = Modifier.matchParentSize()
          )
      } else {
          Icon(
              imageVector = Icons.Outlined.CameraAlt,
              contentDescription = "Adicionar foto",
              tint = colors.onSurfaceVariant,
              modifier = Modifier.size(56.dp)
          )
      }

        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .size(36.dp)
                .clip(CircleShape)
                .background(colors.primary),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Outlined.Add,
                contentDescription = "Adicionar",
                tint = colors.onPrimary,
                modifier = Modifier.size(22.dp)
            )
        }
    }
}