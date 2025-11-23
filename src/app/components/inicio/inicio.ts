import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-inicio',
  imports: [Header],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  usuario: any = null;

  constructor(private router: Router) {
    try {
      const datos = localStorage.getItem('usuario');
        if (datos) {
          this.usuario = JSON.parse(datos);
        }
    } catch {
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
    }
  }
}
