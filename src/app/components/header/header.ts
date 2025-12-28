import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() abrirMenu = new EventEmitter<void>();

  constructor(private auth_service: AuthService) {}

  cerrarSesion() {
    this.auth_service.logout();
  }

}
