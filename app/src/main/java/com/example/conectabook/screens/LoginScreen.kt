package com.example.conectabook.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.conectabook.R
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Alignment
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.conectabook.components.ValidadorSenhaItem
import com.example.conectabook.viewmodel.LoginViewModel


@Composable
fun LoginScreen(
    onEntrarClick: () -> Unit = {},
    modifier: Modifier = Modifier) {



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

        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                modifier = Modifier.size(150.dp),
                painter = painterResource(id = R.drawable.mascote),
                contentDescription = "Mascote Conecta Book sorrindo"
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Bem-vindo ao Conectabook",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Conecte-se com leitores e \nacompanhe suas leituras",
                fontSize = 14.sp,
                color = colors.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

//Card login
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = colors.surface
            ),
            elevation = CardDefaults.cardElevation(6.dp)
        ) {

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp)
            ) {

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
//                    Spacer(modifier = Modifier.height(4.dp)

                    Text(
                        text = "Email inválido!",
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 12.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                TextField(
                    value = viewModel.senha,
                    onValueChange = viewModel::onSenhaChange,
                    placeholder = { Text("Digite sua senha") },
                    isError = viewModel.senhaErro,
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Outlined.Lock,
                            contentDescription = "Icone cadeado",
                            tint = colors.primary
                        )
                    },
                    visualTransformation = PasswordVisualTransformation(),
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


                //mensagem de retorno para erro de senha
                if (viewModel.senha.isNotEmpty()){
                    Column {
                        ValidadorSenhaItem(
                            valido = viewModel.senhaTamanhoValido,
                            texto = "Sua senha deve ter entre 8 e 100 caracteres"
                        )

                        ValidadorSenhaItem(
                            valido = viewModel.senhaSemSequencia,
                            texto = "Não utilize sequências, (ex:123,abc)"
                        )

                        ValidadorSenhaItem(
                            valido = viewModel.senhaSemRepeticao,
                            texto = "Não utilize repetições (ex: aaa)"
                        )
                    }
                }

                //8
                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = "Esqueceu a senha?",
                    fontSize = 12.sp,
                    color = colors.primary,
                    modifier = Modifier.align(Alignment.End)
                )

                Spacer(modifier = Modifier.height(24.dp))


                Button(
                    onClick = {
//                        val valido = viewModel.validarLogin()
//                        if (valido) {
                            onEntrarClick()
//                        }
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
                    Text(
                        text = "Entrar",
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

        Spacer(modifier = Modifier.height(16.dp))

        //login com Google
        Button(
            onClick = {},
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.surface
            ),
            border = BorderStroke(1.dp, colors.outline)
        ) {

            Image(
                painter = painterResource(id = R.drawable.icongoogle),
                contentDescription = "Icon Google",
                modifier = Modifier.size(20.dp)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Text(
                text = "Entrar com Google",
                color = colors.onSurface,
                fontSize = 14.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        //criar conta
        Row {
            Text(
                text = "Não tem conta? ",
                fontSize = 14.sp,
                color = colors.onSurfaceVariant
            )
            Text(
                text = "Criar conta",
                fontSize = 14.sp,
                color = colors.primary,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
