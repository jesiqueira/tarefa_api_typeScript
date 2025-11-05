// src/schemas/interfaces/IUsuarioSchemas.ts

export interface ICriarUsuarioDTO {
  nome: string | undefined
  email: string | undefined
  passwordHash: string
}

export interface ILoginDTO {
  email: string
  senha: string
}

export type IAtualizarUsuarioDTO = Partial<Omit<ICriarUsuarioDTO, 'passwordHash'>>

export interface IUsuarioResponseDTO {
  id: number
  nome: string
  email: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ILoginResponseDTO {
  usuario: IUsuarioResponseDTO
  token: string
}
