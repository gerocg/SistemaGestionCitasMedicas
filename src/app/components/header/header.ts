import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() abrirMenu = new EventEmitter<void>();

  constructor(private router: Router) {}

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
