import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { ConfirmacionService } from '../../services/confirmar-service';
import { ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Cita } from '../interfaces/cita.interface';

@Component({
  selector: 'app-nueva-cita',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule],
  templateUrl: './nueva-cita.html',
  styleUrl: './nueva-cita.css',
})
export class NuevaCita implements OnInit  {
  pacientesFiltrados: any = [];
  pacienteSeleccionado: any = null;
  fecha: Date | null = null;
  hora: string = "";
  tratamiento: string = "";
  observaciones: string = "";
  horasDisponibles: string[] = [];
  configuracion!: ConfiguracionAgenda;
  pacientes: any = [];
  citaId: number | null = null;
  modoEdicion = false;
  modoVista: boolean = false;
  nuevaDesdeCalendario: boolean = false;

  @ViewChild('horaMatSelect') horaMatSelect!: MatSelect;

  constructor(private configuracion_service: ConfiguracionService, private spinner_service: SpinnerService, 
    private cita_service: CitaService, private toast_service: ToastService, private auth_service: AuthService, 
    private pacientes_service: PacientesService, private activated_route: ActivatedRoute, private router: Router,
    private confirmacion_service: ConfirmacionService) {}
  
    ngOnInit(): void {
      this.configuracion_service.getConfiguracion().subscribe({
        next: (config) => {
          this.configuracion = config;
          this.generarHorasDisponibles();
          if(this.nuevaDesdeCalendario){
            this.cargarFechaHoraCalendario();
          }
        }, error: (error) => {
          this.toast_service.show(error?.error ?? 'Error al cargar configuracion', 'error');
          console.error('Error al cargar la configuración:', error);
        }
      });
      
      this.activated_route.queryParams.subscribe(params => {
        this.modoVista = params['mode'] === 'ver';
        this.nuevaDesdeCalendario = params['mode'] === 'nueva'
      });

      const id = this.activated_route.snapshot.paramMap.get('id');
      if (id) {
        this.citaId = +id;
        this.modoEdicion = true;
        this.cargarCita(this.citaId);
      }
  }

  cargarFechaHoraCalendario(){
    if (!this.cita_service.fecha) return;
    let fecha = new Date(this.cita_service.fecha);
    let hora = this.formatearHora(fecha);
        
    if (!this.horasDisponibles.includes(hora)) return;

    this.fecha = fecha;
    this.hora = hora;
    this.horaMatSelect.writeValue(hora);
  }
  
  cargarCita(id: number) {
    this.spinner_service.show();
    this.cita_service.getCita(id).subscribe({
      next: (data: any) => {
        console.log('Cita cargada:', data);
        this.fecha = new Date(data.fechaHora);
        this.hora = this.formatearHora(this.fecha);
        this.tratamiento = data.tratamiento;
        this.observaciones = data.observaciones;
        this.pacienteSeleccionado = {
          id: data.pacienteId,
          nombreCompleto: data.paciente?.usuario?.nombreCompleto
        };
        this.pacientesFiltrados = [this.pacienteSeleccionado];
        this.spinner_service.hide();
      },
      error: (error: any) => {
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al cargar la cita', 'error');
        console.error('Error al cargar la cita:', error);
      }
    });
  }

  generarHorasDisponibles() {
    let { horaInicio, horaFin, intervaloBase, duracionGenerica } = this.configuracion;
    let inicio = this.horaAminutos(horaInicio);
    let fin = this.horaAminutos(horaFin);
    let intervalo = Number(intervaloBase);
    let duracion = Number(duracionGenerica);
    let horas: string[] = [];

    for (let min = inicio; min + duracion <= fin; min += intervalo) {
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
    this.cita_service.nuevaCita(pacienteId, fechaHoraISO, this.configuracion.duracionGenerica, this.tratamiento, this.observaciones).subscribe({  
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
        this.toast_service.show(error?.error ?? 'Error al crear configuracion', 'error');
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
        this.toast_service.show(error?.error ?? 'Error al actualizar la cita', 'error');
      }
    });
  }

  eliminarCita() {
    this.confirmacion_service.confirmar({
      titulo: 'Eliminar archivo',
      mensaje: '¿Seguro que desea eliminar este archivo?',
      textoConfirmar: 'Si',
      textoCancelar: 'No'
    }).subscribe(confirmado => {
      if (!confirmado || !this.citaId) return;
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
          this.toast_service.show(error?.error ?? 'Error al cancelar la cita', 'error');
        }
      });
    });
  }

  puedeElegirPaciente(): boolean {
    return this.auth_service.esAdmin() || this.auth_service.esProfesional();
  }

  limpiarFormulario() {
    this.pacienteSeleccionado = null;
    this.fecha = null;
    this.hora = '';
    this.tratamiento = '';
    this.observaciones = '';
    this.cita_service.limpiarFechaHora();
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

  buscarPacientes(texto: string) {
    if (!texto || texto.length < 3) {
      this.pacientesFiltrados = [];
      return;
    }

    this.pacientes_service.buscarPacientes(texto).subscribe(p => this.pacientesFiltrados = p);
  }

  mostrarPaciente(paciente: any): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  seleccionarPaciente(p: any) {
    this.pacienteSeleccionado = p;
    this.pacientesFiltrados = [];
  }

  pacienteCambio(valor: any) {
    if (typeof valor === 'string') {
      if (!valor) {
        this.pacienteSeleccionado = null;
        this.pacientesFiltrados = [];
        return;
      }
      this.buscarPacientes(valor);
    }
  }
}
