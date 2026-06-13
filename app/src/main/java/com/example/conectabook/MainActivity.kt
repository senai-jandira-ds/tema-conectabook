package com.example.conectabook

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import com.example.conectabook.navigation.AppNavigation
import com.example.conectabook.screens.DetalhesLivroScreen
import com.example.conectabook.screens.LivrosScreen
import com.example.conectabook.ui.theme.ConectaBookTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ConectaBookTheme {
                AppNavigation()
            }
        }
    }
}
