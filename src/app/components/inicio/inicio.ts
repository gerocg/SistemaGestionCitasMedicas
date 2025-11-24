import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Calendario } from '../calendario/calendario';

@Component({
  selector: 'app-inicio',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  sidebarAbierto = false; 

  constructor(private router: Router) {}
}
