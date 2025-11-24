import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      try {
        JSON.parse(usuario); 
        // this.router.navigate(['/inicio']);
        return true;
      } catch {
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
        return false;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}