import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      try {
        JSON.parse(usuario);
        this.router.navigate(['/inicio']);
        return false;
      } catch {
        localStorage.removeItem('usuario');
        return true;
      }
    }

    return true;
  }
}