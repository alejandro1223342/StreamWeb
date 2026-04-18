import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../services/contenido.service';
import { Content } from '../../model/StreamModels';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <header class="header">
        <h1>Mi <span>Lista</span></h1>
        <p>Tus contenidos guardados</p>
      </header>

      <div class="grid">
        @for (item of favorites(); track item.id) {
          <div class="card">
            <span class="badge">{{ item.genero?.nombre }}</span>
            <h3>{{ item.nombre }}</h3>
            <button class="btn-delete" (click)="removeFavorite(item)">Eliminar</button>
          </div>
        } @empty {
          <p class="empty">No tienes favoritos aún.</p>
        }
      </div>
    </main>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 1.5rem; color: #f1f5f9; }
    .header { margin-bottom: 2rem; }
    h1 span { color: #3b82f6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 1rem; }
    .badge { font-size: 0.7rem; color: #3b82f6; font-weight: bold; text-transform: uppercase; }
    h3 { margin: 0.5rem 0 1rem; font-size: 1rem; }
    button { width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid #ef4444; background: none; color: #ef4444; font-weight: bold; cursor: pointer; }
    .empty { text-align: center; color: #94a3b8; grid-column: 1/-1; padding: 3rem; }
  `]

})
export class FavoritesComponent implements OnInit {
  private contentService = inject(ContentService);
  favorites = signal<Content[]>([]);

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.contentService.getFavoritos().subscribe(res => {
      this.favorites.set(res);
    });
  }

  removeFavorite(item: Content) {
    this.contentService.removeFavorito(item.id).subscribe({
      next: () => {
        this.loadFavorites();
      },
      error: () => alert('Error al eliminar de favoritos')
    });
  }
}
