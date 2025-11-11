import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = localStorage.getItem('usuario');

    // Si hay usuario logueado, lo redirigimos a /inicio
    if (usuario) {
      this.router.navigate(['/inicio']);
      return false;
    }

    // Si no hay usuario logueado, puede acceder
    return true;
  }
}