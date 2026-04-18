import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContentService } from '../../services/contenido.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/catalog" class="logo">Stream<span>Web</span></a>
        
        <div class="nav-links">
          <a routerLink="/catalog" routerLinkActive="active">Catálogo</a>
          <a routerLink="/favorites" routerLinkActive="active">Mi Lista</a>
        </div>

        <div class="user-actions">
          @if (authService.currentUser()?.rol === 'cliente') {
            <button class="btn-premium" (click)="makePremium()">Hazte Premium</button>
          } @else {
            <span class="premium-badge">PREMIUM</span>
          }
          <button class="btn-logout" (click)="authService.logout()">Salir</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: #0f172a; border-bottom: 1px solid #1e293b; padding: 0.5rem 0; color: white; position: sticky; top: 0; z-index: 100; }
    .nav-container { max-width: 1100px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.25rem; font-weight: bold; text-decoration: none; color: white; }
    .logo span { color: #3b82f6; }
    .nav-links { display: flex; gap: 1rem; }
    .nav-links a { color: #94a3b8; text-decoration: none; font-size: 0.9rem; }
    .nav-links a.active { color: white; font-weight: bold; }
    .user-actions { display: flex; align-items: center; gap: 1rem; }
    .btn-premium { background: #f59e0b; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; color: black; font-weight: bold; cursor: pointer; font-size: 0.8rem; }
    .premium-badge { color: #f59e0b; font-weight: bold; font-size: 0.8rem; border: 1px solid #f59e0b; padding: 0.2rem 0.5rem; border-radius: 4px; }
    .btn-logout { background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
  `]

})
export class NavbarComponent {
  authService = inject(AuthService);
  contentService = inject(ContentService);

  makePremium() {
    this.contentService.makePremium().subscribe({
      next: () => {
        // Simple hack to refresh session info from token
        // In a real app we might re-login or the backend might return a new token
        alert('¡Bienvenido al nivel PREMIUM! Por favor, inicia sesión de nuevo para aplicar los cambios.');
        this.authService.logout();
      },
      error: (err) => alert('Error al procesar la suscripción')
    });
  }
}
