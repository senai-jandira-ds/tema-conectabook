package com.example.conectabook.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Book
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.PhotoCamera
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.conectabook.viewmodel.MensagemViewModel

@Composable
fun CriarPostcard(
    clubeId: Int,
    usuarioId: Int,
    onPostCriado: () -> Unit,
    viewModel: MensagemViewModel = viewModel()
) {

    var texto by remember { mutableStateOf("") }
    var abrirEditor by remember { mutableStateOf(false) }
    var imagemUri by remember { mutableStateOf<Uri?>(null) }

    val colors = MaterialTheme.colorScheme

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri ->
        imagemUri = uri
    }

    val context = LocalContext.current

    // 🟣 CARD ESTILO ANTIGO (VISUAL LIMPO + CLARO)
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { abrirEditor = true },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        ),
        elevation = CardDefaults.cardElevation(8.dp)
    ) {

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {

            Text(
                text = "Compartilhe sua leitura...",
                fontSize = 16.sp,
                color = colors.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Outlined.PhotoCamera,
                        contentDescription = null,
                        tint = colors.primary
                    )
                    Spacer(Modifier.width(6.dp))
                    Text("Foto", fontSize = 13.sp, color = colors.onSurfaceVariant)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Outlined.Book,
                        contentDescription = null,
                        tint = colors.primary
                    )
                    Spacer(Modifier.width(6.dp))
                    Text("Livro", fontSize = 13.sp, color = colors.onSurfaceVariant)
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Outlined.Edit,
                        contentDescription = null,
                        tint = colors.primary
                    )
                    Spacer(Modifier.width(6.dp))
                    Text("Review", fontSize = 13.sp, color = colors.onSurfaceVariant)
                }
            }
        }
    }

    // 🟡 MODAL DE POSTAGEM (UPLOAD FUNCIONA AQUI)
    if (abrirEditor) {
        AlertDialog(
            onDismissRequest = { abrirEditor = false },
            title = { Text("Nova publicação") },
            text = {

                Column {

                    OutlinedTextField(
                        value = texto,
                        onValueChange = { texto = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Escreva algo...") }
                    )

                    Spacer(Modifier.height(12.dp))

                    Button(onClick = { launcher.launch("image/*") }) {
                        Text(
                            if (imagemUri == null)
                                "Selecionar imagem"
                            else
                                "Imagem selecionada"
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    enabled = texto.isNotBlank(),
                    onClick = {
                        viewModel.criarMensagem(
                            comentario = texto,
                            arquivo = imagemUri,
                            idUsuario = usuarioId,
                            idClube = clubeId,
                            context = context
                        )

                        texto = ""
                        imagemUri = null
                        abrirEditor = false
                        onPostCriado()
                    }
                ) {
                    Text("Publicar")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { abrirEditor = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}