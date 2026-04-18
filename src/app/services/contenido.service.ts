import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Content, Genre, GenericResponse } from '../model/StreamModels';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getContenidos(): Observable<GenericResponse<Content[]>> {
    return this.http.get<GenericResponse<Content[]>>(`${this.apiUrl}/contenidos`);
  }

  getGeneros(): Observable<GenericResponse<Genre[]>> {
    return this.http.get<GenericResponse<Genre[]>>(`${this.apiUrl}/generos`);
  }

  getFavoritos(): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.apiUrl}/favorites`);
  }

  addFavorito(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites`, { id });
  }

  removeFavorito(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${id}`);
  }

  search(query: string): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.apiUrl}/catalog/search`, {
      params: { q: query }
    });
  }

  makePremium(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/premium`, {});
  }
}
