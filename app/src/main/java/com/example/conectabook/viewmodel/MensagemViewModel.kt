package com.example.conectabook.viewmodel

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.conectabook.data.api.RetrofitClient.api
import com.example.conectabook.data.api.dto.MensagemResponse
import com.example.conectabook.data.api.repository.MensagemRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import kotlin.collections.emptyList

class MensagemViewModel: ViewModel() {

    private val repository = MensagemRepository()

    private val _mensagens =
        MutableStateFlow<List<MensagemResponse>>(emptyList())

    val mensagens: StateFlow<List<MensagemResponse>>
            = _mensagens

    fun carregarMensagens() {

        viewModelScope.launch {

            try {

                _mensagens.value =
                    repository.listarMensagens()

            } catch (e: Exception) {

                e.printStackTrace()
            }
        }
    }

    fun criarMensagem(
        comentario: String,
        arquivo: Uri?,
        idUsuario: Int,
        idClube: Int,
        context: Context
    ) {
        viewModelScope.launch {
            try {

                val comentarioBody = comentario.toRequestBody("text/plain".toMediaType())
                val idUsuarioBody = idUsuario.toString().toRequestBody("text/plain".toMediaType())
                val idClubeBody = idClube.toString().toRequestBody("text/plain".toMediaType())

                val arquivoPart = arquivo?.let {
                    uriToMultipart(context, it)
                }

                api.criarMensagem(
                    comentarioBody,
                    idUsuarioBody,
                    idClubeBody,
                    arquivoPart
                )

                carregarMensagens()

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun uriToMultipart(context: Context, uri: Uri): MultipartBody.Part {
        val inputStream = context.contentResolver.openInputStream(uri)
        val file = File.createTempFile("upload", ".jpg", context.cacheDir)

        inputStream.use { input ->
            file.outputStream().use { output ->
                input?.copyTo(output)
            }
        }

        val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())

        return MultipartBody.Part.createFormData(
            "arquivo",
            file.name,
            requestFile
        )
    }

}