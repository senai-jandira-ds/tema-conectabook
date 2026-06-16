package com.example.conectabook.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.conectabook.R
import com.example.conectabook.components.BottomBar
import com.example.conectabook.data.api.session.UserSession

@Composable
fun PerfilScreen(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.colorScheme

    val usuario = UserSession.usuario

    Scaffold(
        bottomBar = { BottomBar(navController = navController) }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8FAFC))
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(24.dp)
        ) {
            Text(
                text = "Meu Perfil",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground
            )

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Image(
                    painter = painterResource(id = R.drawable.mascote),
                    contentDescription = "Foto do usuário",
                    modifier = Modifier
                        .size(96.dp)
                        .clip(CircleShape)
                        .background(colors.primary)
//                        .background(colors.primary.copy(alpha = 0.15f))
                )

                Spacer(modifier = Modifier.width(20.dp))

                Column {
                    Text(
                        text = usuario?.nome ?: "Usuário",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = colors.onBackground
                    )

                    Text(
                        text = "@${usuario?.nome_usuario ?: "usuario"}",
                        fontSize = 15.sp,
                        color = colors.primary,
                        fontWeight = FontWeight.SemiBold
                    )

//                    Spacer(modifier = Modifier.height(6.dp))
//
//                    Text(
//                        text = "Leitora conectada por histórias.",
//                        fontSize = 14.sp,
//                        color = colors.onSurfaceVariant
//                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surface),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    PerfilResumoItem("2", "Lidos")
                    PerfilResumoItem("3", "Quero ler")
                    PerfilResumoItem("7", "Resenhas")
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Informações pessoais",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground
            )

            Spacer(modifier = Modifier.height(12.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = colors.surface),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    PerfilInfoItem(
                        Icons.Outlined.Person,
                        "Nome completo",
                        usuario?.nome ?: "Não informado")

                    PerfilInfoItem(
                        Icons.Outlined.AlternateEmail,
                        "Nome de usuário",
                        usuario?.nome_usuario ?: "Não informado")

                    PerfilInfoItem(
                        Icons.Outlined.Email,
                        "E-mail",
                        usuario?.email ?: "Não informado")

                    PerfilInfoItem(
                        Icons.Outlined.CalendarMonth,
                        "Data de nascimento",
                        "27/08/2007")
//                        usuario?.data_nascimento ?: "Não informado")

                    PerfilInfoItem(Icons.Outlined.MenuBook,
                        "Gênero favorito",
                        "Fantasia")

                        //Genero literario favorito do usuario
//                        usuario?.genero_favorito ?: "Não informado")

                    PerfilInfoItem(Icons.Outlined.Lock,
                        "Senha",
                        "********")
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = { },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = colors.primary
                )
            ) {
                Icon(
                    imageVector = Icons.Outlined.Edit,
                    contentDescription = null
                )

                Spacer(modifier = Modifier.width(8.dp))

                Text(
                    text = "Editar informações",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = {

                    UserSession.logout()

                    navController.navigate("login") {
                        popUpTo(0)
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(14.dp)
            ) {
                Icon(
                    imageVector = Icons.Outlined.Logout,
                    contentDescription = null
                )

                Spacer(modifier = Modifier.width(8.dp))

                Text("Sair")
            }
        }
    }
}

@Composable
fun PerfilResumoItem(
    numero: String,
    texto: String
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = numero,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = texto,
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun PerfilInfoItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    titulo: String,
    valor: String
) {
    val colors = MaterialTheme.colorScheme

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = titulo,
            tint = colors.primary,
            modifier = Modifier.size(26.dp)
        )

        Spacer(modifier = Modifier.width(14.dp))

        Column {
            Text(
                text = titulo,
                fontSize = 13.sp,
                color = colors.onSurfaceVariant
            )

            Text(
                text = valor,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = colors.onSurface
            )
        }
    }
}