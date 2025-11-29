import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-nueva-cita',
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-cita.html',
  styleUrl: './nueva-cita.css',
})
export class NuevaCita {
  pacienteBusqueda = "";
  pacientesFiltrados: any = [];
  pacienteSeleccionado: any = null;
  indexSeleccionado = -1;

  fecha: string = "";
  hora: string = "";
  tratamiento: string = "";
  observaciones: string = "";

  pacientes = [
    { id: 1, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 2, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 3, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 4, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 5, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 6, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 7, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 8, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 9, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 10, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 11, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 12, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 13, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 14, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 15, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 16, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 17, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 18, nombre: "Juan Pérez", documento: "4.567.890-1" },
    { id: 19, nombre: "María Gómez", documento: "5.432.100-9" }
  ];

  filtrarPacientes() {
    let texto = this.normalizar(this.pacienteBusqueda || '');

    if (!texto) {
      this.pacientesFiltrados = [];
      return;
    }

    this.pacientesFiltrados = this.pacientes.filter(p => {
      let nombre = this.normalizar(p.nombre);
      let documento = this.normalizar(p.documento);
      return nombre.includes(texto) || documento.includes(texto);
    });
  }

  seleccionarPaciente(p: any) {
    this.pacienteSeleccionado = p;
    this.pacienteBusqueda = p.nombre;
    this.pacientesFiltrados = []; 
  }

  guardarCita() {
    console.log({
      paciente: this.pacienteSeleccionado,
      fecha: this.fecha,
      hora: this.hora,
      tratamiento: this.tratamiento,
      observaciones: this.observaciones
    });
  }

  normalizar(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  manejarTeclas(event: KeyboardEvent) {
    if (!this.pacientesFiltrados?.length) return;
    console.log(event.key);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.indexSeleccionado = (this.indexSeleccionado + 1) % this.pacientesFiltrados.length;
      this.scrollAItemActivo();
    }

    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.indexSeleccionado = (this.indexSeleccionado - 1 + this.pacientesFiltrados.length) % this.pacientesFiltrados.length;
      this.scrollAItemActivo();
    }

    else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.indexSeleccionado >= 0) {
        this.seleccionarPaciente(this.pacientesFiltrados[this.indexSeleccionado]);
      }
    }
  }

  scrollAItemActivo() {
    setTimeout(() => {
      const items = document.querySelectorAll('.buscador-item');
      const itemActivo = items[this.indexSeleccionado] as HTMLElement;
      if (itemActivo) {
        itemActivo.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
