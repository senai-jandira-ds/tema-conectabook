package com.example.conectabook

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.conectabook.navigation.AppNavigation
import com.example.conectabook.ui.theme.ConectaBookTheme
import org.osmdroid.config.Configuration
import android.preference.PreferenceManager

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // O código de configuração do Osmdroid deve ficar aqui dentro:
        Configuration.getInstance().load(
            applicationContext,
            PreferenceManager.getDefaultSharedPreferences(applicationContext)
        )
        Configuration.getInstance().userAgentValue = packageName

        setContent {
            ConectaBookTheme {
                AppNavigation()
            }
        }
    }
}