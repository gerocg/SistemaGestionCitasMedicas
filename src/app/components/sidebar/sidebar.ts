import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() abierto: boolean = false;   
  @Output() cerrar = new EventEmitter<void>(); 
  submenuAbierto: string | null = null;

  constructor(private auth_service: AuthService) {}

  cambioMenu(menu: string) {
    this.submenuAbierto = this.submenuAbierto === menu ? null : menu;
  }
  
  cerrarSesion() {
    this.auth_service.logout();
  }

  esAdminProfesional(): boolean {
    return this.auth_service.esAdmin() || this.auth_service.esProfesional();
  }
}
