import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  cambioMenu(menu: string) {
    this.submenuAbierto = this.submenuAbierto === menu ? null : menu;
  }
  
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'], {
      state: { email: localStorage.getItem('lastEmail') }
    });
  }
}
