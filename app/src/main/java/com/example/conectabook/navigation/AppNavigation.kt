package com.example.conectabook.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.conectabook.screens.DetalhesLivroScreen
import com.example.conectabook.screens.HomeScreen
import com.example.conectabook.screens.LivrosScreen
import com.example.conectabook.screens.LoginScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(
                onEntrarClick = {
                    navController.navigate(Routes.HOME)
                }
            )
        }

        composable(Routes.HOME) {
            HomeScreen(navController = navController)
        }

        composable(Routes.LIVROS) {
            LivrosScreen(navController = navController)
        }

        composable(Routes.DETALHES_LIVRO) {
            DetalhesLivroScreen(navController = navController)
        }
    }
}