import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <h2>StreamWeb</h2>
        <p>Crea tu cuenta</p>
        <form (submit)="onSubmit()">
          <input type="email" name="email" [(ngModel)]="email" placeholder="Email" required>
          <input type="password" name="password" [(ngModel)]="password" placeholder="Contraseña (min 6)" required minlength="6">
          @if(error()) { <p class="error">{{ error() }}</p> }
          @if(success()) { <p class="success">{{ success() }}</p> }
          <button type="submit" [disabled]="loading()">{{ loading() ? 'Cargando...' : 'Registrar' }}</button>
        </form>
        <p class="footer">¿Ya tienes cuenta? <a routerLink="/login">Entra</a></p>
      </div>
    </div>
  `,
  styles: [`
    .container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: white; }
    .card { background: #1e293b; padding: 2rem; border-radius: 8px; width: 300px; text-align: center; }
    h2 { margin-bottom: 0.5rem; color: #3b82f6; }
    p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
    input { width: 100%; padding: 0.7rem; margin-bottom: 1rem; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: white; }
    button { width: 100%; padding: 0.7rem; border-radius: 4px; border: none; background: #3b82f6; color: white; font-weight: bold; cursor: pointer; }
    .error { color: #ef4444; font-size: 0.8rem; margin-bottom: 1rem; }
    .success { color: #22c55e; font-size: 0.8rem; margin-bottom: 1rem; }
    .footer { margin-top: 1rem; font-size: 0.8rem; }
    .footer a { color: #3b82f6; text-decoration: none; }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    this.success.set('');
    
    this.authService.registrar({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.success.set('¡Usuario registrado! Redirigiendo...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al registrar el usuario');
        this.loading.set(false);
      }
    });
  }
}
