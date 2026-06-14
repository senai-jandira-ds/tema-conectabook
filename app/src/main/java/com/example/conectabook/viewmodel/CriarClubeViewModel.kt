package com.example.conectabook.viewmodel

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.repository.ClubeRepository
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File

class CriarClubeViewModel : ViewModel() {

    private val repository = ClubeRepository()

    fun criarClube(
        context: Context,
        nome: String,
        sobre: String,
        regras: String,
        idGenero: Int,
        imagemUri: Uri?,
        onSuccess: () -> Unit
    ) {

        viewModelScope.launch {

            try {

                val nomeBody =
                    nome.toRequestBody("text/plain".toMediaTypeOrNull())

                val sobreBody =
                    sobre.toRequestBody("text/plain".toMediaTypeOrNull())

                val regrasBody =
                    regras.toRequestBody("text/plain".toMediaTypeOrNull())

                val idGeneroBody =
                    idGenero.toString()
                        .toRequestBody("text/plain".toMediaTypeOrNull())

                var fotoPart: MultipartBody.Part? = null

                if (imagemUri != null) {

                    val inputStream =
                        context.contentResolver.openInputStream(imagemUri)

                    val tempFile =
                        File.createTempFile("clube", ".jpg")

                    tempFile.outputStream().use { output ->
                        inputStream?.copyTo(output)
                    }

                    val requestFile =
                        tempFile.asRequestBody("image/*".toMediaTypeOrNull())

                    fotoPart =
                        MultipartBody.Part.createFormData(
                            "foto",
                            tempFile.name,
                            requestFile
                        )
                }

                repository.criarClube(
                    nomeBody,
                    sobreBody,
                    regrasBody,
                    idGeneroBody,
                    fotoPart
                )

                onSuccess()

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}