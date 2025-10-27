import { Component, input } from '@angular/core';

@Component({
  selector: 'app-saludos',
  imports: [],
  templateUrl: './saludos.html',
  styleUrl: './saludos.css',
})
export class Saludos {
  mensaje = input('Mensaje de saludo');
}
