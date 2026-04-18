import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { CatalogComponent } from './components/catalog/catalog';
import { FavoritesComponent } from './components/favorites/favorites';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'catalog', 
    component: CatalogComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'favorites', 
    component: FavoritesComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: '**', redirectTo: 'catalog' }
];

