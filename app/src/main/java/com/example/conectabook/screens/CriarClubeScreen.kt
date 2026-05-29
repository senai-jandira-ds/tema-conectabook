package com.example.conectabook.screens

import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text


import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.conectabook.components.AppHeader
import com.example.conectabook.components.BottomBar
import com.example.conectabook.components.FotoClubePicker

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CriarClubeScreen(
    navController: NavController,
    modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    var imagemUri by remember { mutableStateOf<Uri?>(null) }

    var nome by remember { mutableStateOf("") }

    var descricao by remember { mutableStateOf("") }

    var genero by remember { mutableStateOf("") }

    var regras by remember { mutableStateOf("") }

    var expandido by remember { mutableStateOf(false) }

    val generos = listOf(
        "Fantasia",
        "Romance",
        "Ficção científica",
        "Mistério",
        "Terror",
        "Aventura"

    )

    Scaffold(
        bottomBar = {
            BottomBar(navController)
        }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(colors.primary)
                .padding(paddingValues)
        ) {

            AppHeader(
                titulo = "Criar Clube",
                mostrarVoltar = true,
                mostrarAvatar = true,
                onVoltarClick = {
                    navController.popBackStack()
                }
            )

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(
                        RoundedCornerShape(
                            topStart = 24.dp,
                            topEnd = 24.dp
                        )
                    )
                    .background(Color(0xFFF8FAFC)),
                contentPadding = PaddingValues(24.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {

                item {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {

                        Text("Imagem do clube")


                        Spacer(modifier = Modifier.height(12.dp))



                        FotoClubePicker(
                            imagemUri = imagemUri,
                            onImagemSelecionada = {
                                imagemUri = it
                            }
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Adicione uma imagem para representar seu clube",
                                color = colors.onSurfaceVariant
                            )
                    }
                }

                item {
                    OutlinedTextField(
                        value = nome,
                        onValueChange = {nome = it},
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        label = {
                            Text("Nome do Clube")
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                item {
                    ExposedDropdownMenuBox(
                        expanded = expandido,
                        onExpandedChange = {
                            expandido = !expandido
                        }
                    ) {
                        OutlinedTextField(
                            value = genero,
                            onValueChange = {},
                            readOnly = true,
                            modifier = Modifier
                                .fillMaxWidth()
                                .menuAnchor(),
                            label = {
                                Text("Gênero")
                            },
                            trailingIcon = {
                                ExposedDropdownMenuDefaults.TrailingIcon(
                                    expanded = expandido
                                )
                            },
                            shape = RoundedCornerShape(12.dp)
                        )

                        ExposedDropdownMenu(
                            expanded = expandido,
                            onDismissRequest = {
                                expandido = false
                            }
                        ) {
                            generos.forEach { generoSelecionado ->

                                DropdownMenuItem(
                                    text = {
                                        Text(generoSelecionado)
                                    },
                                    onClick = {
                                        genero = generoSelecionado
                                        expandido = false
                                    }
                                )
                            }
                        }
                    }
                }


                item {
                    OutlinedTextField(
                        value = descricao,
                        onValueChange = {descricao = it},
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(120.dp),
                        label = {
                            Text("Sobre")
                        },
                        shape = RoundedCornerShape(12.dp)
                    )
                }


                item {
                    OutlinedTextField(
                        value = regras,
                        onValueChange = {regras = it},
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp),
                        label = {
                            Text("Regras")
                        },
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                item {
                    Button(
                        onClick = {},
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Text("Criar Clube")
                    }
                }
            }
        }
    }
}
