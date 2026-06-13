package com.example.conectabook.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AutoStories
import androidx.compose.material.icons.outlined.Groups
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LocalCafe
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.conectabook.navigation.Routes

@Composable
fun BottomBar(
    navController: NavController
) {

    val colors = MaterialTheme.colorScheme

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val rotaAtual = navBackStackEntry?.destination?.route

    NavigationBar(
        containerColor = colors.surface
    ) {


        NavigationBarItem(
            selected = false,
            onClick = {},
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Groups,
                    contentDescription = "Clubes"
                )
            },
            label = {
                Text("Clubes")
            }
        )


        NavigationBarItem(
            selected = rotaAtual == Routes.LIVROS,
            onClick = {
                navController.navigate(Routes.LIVROS)
            },
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Search,
                    contentDescription = "Livros"
                )
            },
            label = {
                Text("Livros")
            }
        )

        NavigationBarItem(
            selected = rotaAtual == Routes.HOME,
            onClick = {
                navController.navigate(Routes.HOME)
            },
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Home,
                    contentDescription = "Home"
                )
            },
            label = {
                Text("Início")
            }
        )

        NavigationBarItem(
            selected = false,
            onClick = {},
            icon = {
                Icon(
                    imageVector = Icons.Outlined.LocalCafe,
                    contentDescription = "Cafeterias"
                )
            },
            label = {
                Text("Cafeterias")
            }
        )

        NavigationBarItem(
            selected = false,
            onClick = {},
            icon = {
                Icon(
                    imageVector = Icons.Outlined.Person,
                    contentDescription = "Perfil"
                )
            },
            label = {
                Text("Perfil")
            }
        )
    }
}