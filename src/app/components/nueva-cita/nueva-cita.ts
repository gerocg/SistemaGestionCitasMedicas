import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';
import { ConfiguracionService } from '../../services/configuracion-service';
import { ConfiguracionAgenda } from '../interfaces/configuracion-agenda.interface';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { PacientesService } from '../../services/pacientes-services';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CitaService } from '../../services/cita-service';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nueva-cita',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule],
  templateUrl: './nueva-cita.html',
  styleUrl: './nueva-cita.css',
})
export class NuevaCita implements OnInit {
  pacienteBusqueda = "";
  pacientesFiltrados: any = [];
  pacienteSeleccionado: any = null;
  indexSeleccionado = -1;
  fecha: Date | null = null;
  hora: string = "";
  tratamiento: string = "";
  observaciones: string = "";
  horasDisponibles: string[] = [];
  configuracion!: ConfiguracionAgenda;
  pacientes: any = [];
  citaId: number | null = null;
  modoEdicion = false;

  constructor(private configuracion_service: ConfiguracionService, private spinner_service: SpinnerService, 
    private cita_service: CitaService, private toast_service: ToastService, private auth_service: AuthService, 
    private pacientes_service: PacientesService, private activated_route: ActivatedRoute, private router: Router) {}
 
  ngOnInit(): void {
    this.configuracion = this.configuracion_service.getConfiguracion();
    this.generarHorasDisponibles();
    this.cargarPacientes();

    this.activated_route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.citaId = +id;
        this.cargarCita(this.citaId);
      }
    });
  }
  
  cargarPacientes() {
    this.spinner_service.show();
    this.pacientes_service.GetPacientes().subscribe({
      next: (data: any) => {
        console.log('Pacientes cargados:', data);
        this.spinner_service.hide();  
        this.pacientes = data;
      },
      error: (error: any) => {
        this.spinner_service.hide();
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  cargarCita(id: number) {
    this.spinner_service.show();
    this.cita_service.getCita(id).subscribe({
      next: (data: any) => {
        console.log('Cita cargada:', data);
        this.fecha = new Date(data.fechaHora);
        this.hora = this.formatearHora(this.fecha);
        console.log('Hora formateada:', this.hora);
        this.tratamiento = data.tratamiento;
        this.observaciones = data.observaciones;
        this.pacienteSeleccionado = {
          id: data.pacienteId,
          nombreCompleto: data.paciente?.usuario?.nombreCompleto
        };
        this.pacienteBusqueda = this.pacienteSeleccionado.nombreCompleto;
        this.spinner_service.hide();
      },
      error: (error: any) => {
        this.spinner_service.hide();
        console.error('Error al cargar la cita:', error);
      }
    });
  }

  generarHorasDisponibles() {
    const { horaInicio, horaFin, duracionGenerica } = this.configuracion;
    const inicio = this.horaAminutos(horaInicio);
    const fin = this.horaAminutos(horaFin);
    const duracion = Number(duracionGenerica); 
    const horas: string[] = [];

    for (let min = inicio; min + duracion <= fin; min += duracion) {
      horas.push(this.minutosAhora(min));
    }

    this.horasDisponibles = horas;

    if (!this.hora && horas.length) {
      this.hora = horas[0];
    }
  }

  horaAminutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  minutosAhora(min: number): string {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  filtrarPacientes() {
    let texto = this.normalizar(this.pacienteBusqueda || '');

    if (!texto) {
      this.pacientesFiltrados = [];
      this.pacienteSeleccionado = null;
      return;
    }

    this.pacienteSeleccionado = null;

    this.pacientesFiltrados = this.pacientes.filter((p: any) => {
      let nombre = this.normalizar(p.nombreCompleto);
      return nombre.includes(texto);
    });
  }

  seleccionarPaciente(p: any) {
    this.pacienteSeleccionado = p;
    this.pacienteBusqueda = p.nombreCompleto;
    this.pacientesFiltrados = [];
  }

  guardarCita() {
    if (!this.fecha || !this.hora) {
      this.toast_service.show('Debe completar los campos obligatorios.', 'error');
      return;
    }
    
    if (this.puedeElegirPaciente() && !this.pacienteSeleccionado) {
      this.toast_service.show('Debe seleccionar un paciente.', 'error');
      return;
    }
    
    this.spinner_service.show();
    let pacienteId = this.puedeElegirPaciente() ? this.pacienteSeleccionado?.id ?? null : null;
    let fechaHoraISO = this.construirFechaHoraISO(this.fecha, this.hora);
    this.cita_service.NuevaCita(pacienteId, fechaHoraISO, this.configuracion.duracionGenerica, this.tratamiento, this.observaciones).subscribe({  
      next: (data: any) => {
        this.spinner_service.hide();
        console.log('Cita creada:', data);
        this.toast_service.show('Cita creada con éxito!', 'success');
        this.cita_service.notificarRefrescarCalendario();
        this.router.navigate(['/inicio/calendario']);
        this.limpiarFormulario();
      },
      error: (error: any) => {
        console.error('Error al crear la cita:', error);
        this.spinner_service.hide();
        this.toast_service.show('Error al crear la cita.', 'error');
      }
    });
  }

  actualizarCita() {
    if (!this.citaId) return;

    if (!this.fecha || !this.hora) {
      this.toast_service.show('Debe completar los campos obligatorios.', 'error');
      return;
    }

    if (this.puedeElegirPaciente() && !this.pacienteSeleccionado) {
      this.toast_service.show('Debe seleccionar un paciente.', 'error');
      return;
    }

    this.spinner_service.show();
    let fechaHoraISO = this.construirFechaHoraISO(this.fecha, this.hora);

    let citaNueva = {
      fechaHora: fechaHoraISO,
      duracion: this.configuracion.duracionGenerica,
      tratamiento: this.tratamiento,
      observaciones: this.observaciones,
      pacienteId: this.pacienteSeleccionado?.id
    };

    this.cita_service.actualizarCita(this.citaId, citaNueva).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Cita actualizada correctamente', 'success');
        this.cita_service.notificarRefrescarCalendario();
        this.router.navigate(['/inicio/calendario']);
      },
      error: (error) => {
        console.error(error);
        this.spinner_service.hide();
        this.toast_service.show('Error al actualizar la cita', 'error');
      }
    });
  }

  eliminarCita() {
    if (!this.citaId) return;

    if (!confirm('¿Seguro que desea cancelar esta cita?')) return;
    this.spinner_service.show();

    this.cita_service.eliminarCita(this.citaId).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Cita cancelada', 'success');
        this.cita_service.notificarRefrescarCalendario();
        this.router.navigate(['/inicio/calendario']);
      },
      error: (error) => {
        console.error(error);
        this.spinner_service.hide();
        this.toast_service.show('Error al cancelar la cita', 'error');
      }
    });
  }



  normalizar(texto: string) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

  puedeElegirPaciente(): boolean {
    return this.auth_service.esAdmin() || this.auth_service.esProfesional();
  }

  limpiarFormulario() {
    this.pacienteSeleccionado = null;
    this.pacienteBusqueda = '';
    this.fecha = null;
    this.hora = '';
    this.tratamiento = '';
    this.observaciones = '';
  }

  construirFechaHoraISO(fecha: Date, hora: string): string {
    const [h, m] = hora.split(':').map(Number);

    const fechaHora = new Date(fecha);
    fechaHora.setHours(h, m, 0, 0);

    const yyyy = fechaHora.getFullYear();
    const mm = String(fechaHora.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaHora.getDate()).padStart(2, '0');
    const hh = String(fechaHora.getHours()).padStart(2, '0');
    const mi = String(fechaHora.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
  }

  formatearHora(fecha: string | Date): string {
    const d = new Date(fecha);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  }
}
