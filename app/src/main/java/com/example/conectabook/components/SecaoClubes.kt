package com.example.conectabook.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.conectabook.R

data class ClubeUi(
    val capa: Int,
    val nome: String,
    val membros: String
)

@Composable
fun SecaoClubes(modifier: Modifier = Modifier) {

    val colors = MaterialTheme.colorScheme

    val clubes = listOf(
        ClubeUi(
            capa = R.drawable.clubelobo,
            nome = "Clube dos Lobos",
            membros = "1,2 mil membros"
        ),

        ClubeUi(
            capa = R.drawable.clubecartas,
            nome = "Entre Cartas e Eternidade",
            membros = "850 membros"
        ),

        ClubeUi(
            capa = R.drawable.clubemar,
            nome = "Semideuses & Bruxos",
            membros = "2,1 mil membros"
        ),

        ClubeUi(
            capa = R.drawable.clubebruxos,
            nome = "Camp Hogwarts",
            membros = "980 membros"
        )
    )

    Column(modifier = Modifier
        .fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Meus Clubes de Literatura",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = colors.onBackground
            )

            Text(
                text = "Ver todos",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = colors.primary
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {

            items(clubes) { clube ->

                ClubeCard(
                    capa = clube.capa,
                    nome = clube.nome,
                    membros = clube.membros
                )
            }
        }
    }
}