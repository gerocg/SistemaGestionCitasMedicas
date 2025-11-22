import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink,  CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  usuarioLogueado = signal<boolean>(false);
  menuAbierto = false;

  constructor() {
     // Solo accedemos a localStorage si existe 'window'
    if (typeof window !== 'undefined') {
      this.usuarioLogueado.set(!!localStorage.getItem('usuario'));

      window.addEventListener('storage', () => {
        this.usuarioLogueado.set(!!localStorage.getItem('usuario'));
      });
    }
  }

  cambioEstadoMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  cerrarSesion() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
      this.usuarioLogueado.set(false);
    }
    this.cerrarMenu();
  }
}
