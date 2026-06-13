package com.example.conectabook.navigation

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.conectabook.screens.CadastroScreen
import com.example.conectabook.screens.ClubeScreen
import com.example.conectabook.screens.CriarClubeScreen
import com.example.conectabook.screens.DetalhesLivroScreen
import com.example.conectabook.screens.HomeScreen
import com.example.conectabook.screens.LivrosScreen
import com.example.conectabook.screens.LoginScreen
import com.example.conectabook.screens.PerfilScreen
import okhttp3.Route

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
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
                    onCriarContaClick = {
                        navController.navigate(Routes.CADASTRO)
                }
            )
        }

        composable(Routes.CADASTRO){
            CadastroScreen(
                onCadastroSucesso = {
                    navController.navigate(Routes.LOGIN){
                        popUpTo(Routes.CADASTRO) {inclusive = true}
                    }
                },
                onVoltarLoginClick = {
                    navController.popBackStack()
                }
            )
        }

        composable(Routes.HOME) {
            HomeScreen(navController = navController)
        }

        composable(Routes.LIVROS) {
            LivrosScreen(navController = navController)
        }

        composable(
            route = "detalhes_livro/{livroId}"
        ) { backStackEntry ->

            val livroId = Uri.decode(
                backStackEntry.arguments?.getString("livroId") ?: ""
            )

            DetalhesLivroScreen(
                navController = navController,
                livroId = livroId
            )
        }

        composable(Routes.PERFIL) {
            PerfilScreen(navController = navController)
        }

        composable(Routes.CLUBES) {
            ClubeScreen(navController = navController)
        }

        composable(Routes.CRIAR_CLUBE) {
            CriarClubeScreen(navController = navController)
        }
    }
}