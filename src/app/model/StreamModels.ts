export interface Genre {
  id: number;
  nombre: string;
}

export interface Content {
  id: number;
  nombre: string;
  generoId: number;
  genero?: Genre;
  favorito?: boolean;
}

export interface User {
  id: number;
  email: string;
  rol: 'cliente' | 'premium';
}

export interface AuthResponse {
  message: string;
  data: string; // Token
}

export interface GenericResponse<T> {
  message: string;
  data: T;
}
