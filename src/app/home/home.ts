import { Component, signal } from '@angular/core';
import { Saludos } from '../components/saludos/saludos';
import { Counter } from '../components/counter/counter';

@Component({
  selector: 'app-home',
  imports: [Saludos, Counter],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  mensajeHome = signal('¡Bienvenido a la página principal!');

  keyUpHandler(event: KeyboardEvent) {
    console.log(`El usuario presionó la tecla: ${event.key}`);
  }
}
