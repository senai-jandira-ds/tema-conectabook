package com.example.conectabook.screens

import android.R.attr.text
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.conectabook.R
import com.example.conectabook.ui.theme.BlueInfo
import com.example.conectabook.viewmodel.LoginViewModel

@Composable
fun EsqueceuSenhaScreen (modifier: Modifier = Modifier) {

    val viewModel: LoginViewModel = viewModel()

    val colors = MaterialTheme.colorScheme

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colors.background)
            .padding(horizontal = 24.dp)
            .padding(top = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            modifier = Modifier.size(150.dp),
            painter = painterResource(id = R.drawable.mascotesecurity),
            contentDescription = "Mascote Conecta Book de terno e óculos escuro que remete a um segurança"
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Esqueci minha senha",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = colors.onBackground,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Digite seu email e enviaremos um código\npara você redefinir sua senha",
            fontSize = 14.sp,
            color = colors.onSurfaceVariant,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        //Card email
        Card(
            modifier = Modifier.fillMaxWidth(),
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
                    text = "Email",
                    fontSize = 14.sp,
                    color = colors.onSurfaceVariant,
                    modifier = Modifier.padding(bottom = 4.dp)
                )

                TextField(
                    value = viewModel.email,
                    onValueChange = viewModel::onEmailChange,
                    placeholder = { Text("Digite seu email") },
                    isError = viewModel.emailErro,
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Outlined.Email,
                            contentDescription = "Icone Email",
                            tint = colors.primary
                        )
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = colors.surfaceVariant,
                        unfocusedContainerColor = colors.surfaceVariant,
                        focusedIndicatorColor = colors.primary,
                        unfocusedIndicatorColor = Color.Transparent
                    )
                )

                //mensagem de retorno do erro
                if (viewModel.emailErro){
                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Email inválido!",
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 12.sp
                    )
                }
//20
                Spacer(modifier = Modifier.height(16.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            color = BlueInfo.copy(alpha = 0.1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .padding(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {

                        Icon(
                            imageVector = Icons.Outlined.Info,
                            contentDescription = "Icone Info",
                            tint = BlueInfo
                        )

                        Spacer(modifier = Modifier.width(8.dp))

                        Text(
                            text = "Enviaremos um código de verificação\npara o email informado.",
                            fontSize = 12.sp,
                            color = colors.onSurfaceVariant
                        )
                    }
                }

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                //código
                                      },
                            enabled = viewModel.habilitarClicar,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = colors.primary
                            )
                        ) {
                            Text(text = "Enviar código",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = colors.onPrimary
                                )
                        }
                    }
                }

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier,
            verticalAlignment = Alignment.CenterVertically
        ) {

            Divider(
                modifier = Modifier.weight(1f),
                color = colors.outline
            )

            Text(
                modifier = Modifier
                    .padding(horizontal = 8.dp),
                text = "ou",
                fontSize = 12.sp,
                color = colors.onSurfaceVariant
            )

            Divider(
                modifier = Modifier.weight(1f),
                color = colors.outline
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        //voltar tela login
        Button(
            onClick = {},
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.surface
            ),
            border = BorderStroke(1.dp, colors.primary)
        ) {
            Text(
                text = "Voltar para o login",
                color = colors.primary,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
