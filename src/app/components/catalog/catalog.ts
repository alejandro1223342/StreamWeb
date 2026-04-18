import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../services/contenido.service';
import { AuthService } from '../../services/auth.service';
import { Content, Genre } from '../../model/StreamModels';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <header class="header">
        <input type="text" placeholder="Buscar contenido..." [(ngModel)]="searchQuery" (input)="onSearchChange($event)">
        <div class="filter-bar">
          <button [class.active]="selectedGenre() === null" (click)="selectGenre(null)">Todos</button>
          @for (g of genres(); track g.id) {
            <button [class.active]="selectedGenre() === g.id" (click)="selectGenre(g.id)">{{ g.nombre }}</button>
          }
        </div>
      </header>

      <div class="grid">
        @for (item of filteredContents(); track item.id) {
          <div class="card">
            <div class="card-body">
              <span class="badge">{{ getGenreName(item.generoId) }}</span>
              <h3>{{ item.nombre }}</h3>
              <button (click)="toggleFavorite(item)">+ Favorito</button>
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 1.5rem; color: #f1f5f9; }
    .header { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
    input { padding: 0.8rem; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: white; width: 100%; }
    .filter-bar { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; }
    .filter-bar button { padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid #334155; background: none; color: #94a3b8; cursor: pointer; white-space: nowrap; }
    .filter-bar button.active { background: #3b82f6; color: white; border-color: #3b82f6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .card { background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 1rem; }
    .badge { font-size: 0.7rem; color: #3b82f6; font-weight: bold; text-transform: uppercase; }
    h3 { margin: 0.5rem 0 1rem; font-size: 1rem; }
    button { width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid #3b82f6; background: none; color: #3b82f6; font-weight: bold; cursor: pointer; }
    button:hover { background: rgba(59, 130, 246, 0.1); }
  `]

})
export class CatalogComponent implements OnInit {
  private contentService = inject(ContentService);
  private authService = inject(AuthService);

  contents = signal<Content[]>([]);
  genres = signal<Genre[]>([]);
  selectedGenre = signal<number | null>(null);
  searchQuery = '';
  
  private searchSubject = new Subject<string>();

  filteredContents = computed(() => {
    let list = this.contents();
    if (this.selectedGenre()) {
      list = list.filter(c => c.generoId === this.selectedGenre());
    }
    return list;
  });

  ngOnInit() {
    this.loadData();
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  loadData() {
    this.contentService.getGeneros().subscribe(res => this.genres.set(res.data));
    this.contentService.getContenidos().subscribe(res => this.contents.set(res.data));
  }

  onSearchChange(event: any) {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(query: string) {
    if (!query) {
      this.loadData();
      return;
    }
    this.contentService.search(query).subscribe(res => {
      this.contents.set(res);
    });
  }

  selectGenre(id: number | null) {
    this.selectedGenre.set(id);
  }

  getGenreName(id: number) {
    return this.genres().find(g => g.id === id)?.nombre || 'Contenido';
  }

  toggleFavorite(item: Content) {
    this.contentService.addFavorito(item.id).subscribe({
      next: () => alert('Añadido a favoritos'),
      error: (err) => alert(err.error?.message || 'No se pudo añadir a favoritos')
    });
  }
}
