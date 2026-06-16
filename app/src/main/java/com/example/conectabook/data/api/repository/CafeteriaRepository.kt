package com.example.conectabook.data.api.repository

import com.example.conectabook.data.api.mock.CafeteriaMock

class CafeteriaRepository {
    fun listarCafeterias() = CafeteriaMock.listar()
}