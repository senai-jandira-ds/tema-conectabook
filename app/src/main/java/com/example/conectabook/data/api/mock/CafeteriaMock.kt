package com.example.conectabook.data.api.mock

import com.example.conectabook.data.api.model.Cafeteria

object CafeteriaMock {

    fun listar(): List<Cafeteria> {
        return listOf(
            Cafeteria(
                nome = "Café Central",
                descricao = "Ambiente silencioso",
                wifi = true,
                silencio = true,
                avaliacao = 4.8
            ),
            Cafeteria(
                nome = "Book Coffee",
                descricao = "Perfeito para leitura",
                wifi = true,
                silencio = true,
                avaliacao = 4.6
            )
        )
    }
}