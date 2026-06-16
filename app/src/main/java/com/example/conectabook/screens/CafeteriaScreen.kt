package com.example.conectabook.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.conectabook.components.BottomBar
import com.example.conectabook.viewmodel.CafeteriaViewModel
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

// ─── COR DO PIN ──────────────────────────────────────────────────────────────
// ⚠️  EDITE AQUI para mudar a cor de todos os pins do mapa
private val CorDoPin = Color(0xFF1565C0)

private val BrancoCard = Color(0xFFFFFFFF)

// ─── Cafeterias de exemplo (lat, lng, nome) ──────────────────────────────────
private val cafeterias = listOf(
    Triple(-23.5505, -46.6333, "Cafeteria Centro"),
    Triple(-23.5329, -46.6395, "Cafeteria Santana"),
    Triple(-23.6015, -46.7011, "Cafeteria Taboão"),
    Triple(-23.6230, -46.6980, "Cafeteria Embu"),
    Triple(-23.6580, -46.6680, "Cafeteria Sul"),
    Triple(-23.6447, -46.5338, "Cafeteria São Bernardo")
)

@Composable
fun CafeteriaScreen(
    viewModel: CafeteriaViewModel = viewModel(),
    navController: NavController
) {
    val busca by viewModel.busca.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        Configuration.getInstance().userAgentValue = context.packageName
    }

    Scaffold(
        bottomBar = { BottomBar(navController = navController) }
    ) { paddingValues ->

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)          // respeita o espaço do BottomBar
        ) {

            // ── MAPA INTERATIVO (osmdroid / OpenStreetMap) ──────────────────
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { ctx ->
                    MapView(ctx).apply {
                        setTileSource(TileSourceFactory.MAPNIK)
                        setMultiTouchControls(true)
                        controller.setZoom(11.0)
                        controller.setCenter(GeoPoint(-23.5505, -46.6333))

                        cafeterias.forEach { (lat, lng, nome) ->
                            val marker = Marker(this)
                            marker.position = GeoPoint(lat, lng)
                            marker.title    = nome
                            // Para colorir o pin, descomente:
                            // val drawable = AppCompatResources.getDrawable(ctx, R.drawable.ic_pin)!!
                            // DrawableCompat.setTint(DrawableCompat.wrap(drawable), android.graphics.Color.parseColor("#1565C0"))
                            // marker.icon = drawable
                            overlays.add(marker)
                        }
                    }
                },
                update = { /* geocoding futuro aqui */ }
            )

            // ── COLUNA SUPERIOR: seta voltar + search bar ───────────────────
            Column(
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .statusBarsPadding()
                    .padding(top = 12.dp, start = 16.dp, end = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Botão voltar
                IconButton(
                    onClick = { navController.popBackStack() },
                    modifier = Modifier
                        .size(40.dp)
                        .shadow(4.dp, CircleShape)
                        .then(
                            Modifier
                        )
                ) {
                    Surface(
                        shape = CircleShape,
                        color = BrancoCard,
                        shadowElevation = 4.dp,
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.ArrowBack,
                                contentDescription = "Voltar",
                                tint = Color(0xFF424242),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }

                // Search bar
                BuscaCidadeBar(
                    busca = busca,
                    onBuscaChange = viewModel::setBusca
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE: BuscaCidadeBar
// ─────────────────────────────────────────────────────────────────────────────
@Composable
private fun BuscaCidadeBar(
    busca: String,
    onBuscaChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(6.dp, RoundedCornerShape(50)),
        shape = RoundedCornerShape(50),
        color = BrancoCard
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            TextField(
                value = busca,
                onValueChange = onBuscaChange,
                placeholder = {
                    Text(
                        text = "Insira uma cidade",
                        color = Color(0xFF9E9E9E),
                        fontSize = 15.sp
                    )
                },
                singleLine = true,
                modifier = Modifier.weight(1f),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor   = Color.Transparent,
                    unfocusedContainerColor = Color.Transparent,
                    focusedIndicatorColor   = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                )
            )
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Buscar cidade",
                tint = Color(0xFF616161),
                modifier = Modifier.size(22.dp)
            )
        }
    }
}