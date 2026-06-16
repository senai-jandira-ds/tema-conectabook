package com.example.conectabook.data.api


import com.example.conectabook.data.api.dto.AdicionarLivroRequest
import com.example.conectabook.data.api.dto.CriarClubeResponse
import com.example.conectabook.data.api.dto.EstanteApiResponse
import com.example.conectabook.data.api.model.CadastroRequest
import com.example.conectabook.data.api.model.CadastroResponse
import com.example.conectabook.data.api.model.ClubeApiResponse
import com.example.conectabook.data.api.dto.EstanteResponse
import com.example.conectabook.data.api.dto.UsuarioApiResponse
import com.example.conectabook.data.api.model.GeneroUsuarioRequest
import com.example.conectabook.data.api.model.GenerosApiResponse
import com.example.conectabook.data.api.model.LoginRequest
import com.example.conectabook.data.api.model.LoginResponse
import com.example.conectabook.data.api.model.MensagemApiResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface ApiService {

   @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): LoginResponse

    @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/usuarios")
    suspend fun cadastrarUsuario(
        @Body request: CadastroRequest
    ): CadastroResponse

    @GET("v1/conectaBook/generos")
    suspend fun listarGeneros(): GenerosApiResponse

    @Headers("Content-Type: application/json")
    @POST("v1/conectaBook/genero-usuario")
    suspend fun salvarGeneroUsuario(
        @Body request: GeneroUsuarioRequest
    ): CadastroResponse

    @GET("v1/conectaBook/clubes")
    suspend fun listarClubes(): ClubeApiResponse

    @Multipart
    @POST("v1/conectaBook/clubes")
    suspend fun criarClube(
     @Part("nome") nome: RequestBody,

     @Part("sobre") sobre: RequestBody,

     @Part("regras") regras: RequestBody,

     @Part("id_genero") idGenero: RequestBody,

     @Part foto: MultipartBody.Part?
   ): CriarClubeResponse

     @GET("v1/conectaBook/mensagem")
     suspend fun listarMensagens(): MensagemApiResponse

    @GET("v1/conectaBook/estante/usuario/{idUsuario}/lendo")
    suspend fun listarLendo(
        @Path("idUsuario") idUsuario: Int
    ): EstanteApiResponse

    @GET("v1/conectaBook/estante/usuario/{idUsuario}/quero-ler")
    suspend fun listarQueroLer(
        @Path("idUsuario") idUsuario: Int
    ): EstanteApiResponse

    @GET("v1/conectaBook/estante/usuario/{idUsuario}/lido")
    suspend fun listarLidos(
        @Path("idUsuario") idUsuario: Int
    ): EstanteApiResponse
     @Headers("Content-Type: application/json")
     @POST("v1/conectaBook/estante")
     suspend fun adicionarLivro(@Body request: AdicionarLivroRequest): EstanteResponse

    @GET("v1/conectaBook/usuarios/{id}")
    suspend fun buscarUsuarioPorId(
        @Path("id") id: Int
    ): UsuarioApiResponse

    @Multipart
    @POST("v1/conectaBook/mensagem")
    suspend fun criarMensagem(
        @Part("comentario") comentario: RequestBody,
        @Part("id_usuario") idUsuario: RequestBody,
        @Part("id_clube") idClube: RequestBody,
        @Part arquivo: MultipartBody.Part?
    )
}