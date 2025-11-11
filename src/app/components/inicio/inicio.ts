import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  usuario: any = null;

  constructor(private router: Router) {
    if (typeof window !== 'undefined' && localStorage) {
      const datos = localStorage.getItem('usuario');
      if (datos) {
        this.usuario = JSON.parse(datos);
      }
    }
  }
}
