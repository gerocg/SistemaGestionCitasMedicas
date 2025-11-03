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
  usuarioLogueado = signal(false);
  menuAbierto = false;

  cambioEstadoMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  cerrarSesion() {
    this.usuarioLogueado.set(false);
    console.log('Sesión cerrada');
  }
}
