import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {
  valorContador = signal(0);

  incrementar() {
    this.valorContador.update((value) => value + 1);
  }

  descender() {
    this.valorContador.update((value) => value - 1);
  }

  reiniciar() {
    this.valorContador.set(0);
  }

}
