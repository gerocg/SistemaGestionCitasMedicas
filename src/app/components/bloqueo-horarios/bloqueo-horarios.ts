import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BloqueoHorario } from '../interfaces/bloqueo-horario.interface';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { BloqueoHorariosService } from '../../services/bloqueo-horarios.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfiguracionService } from '../../services/configuracion-service';
import { ConfiguracionAgenda } from '../interfaces/configuracion-agenda.interface';

@Component({
  selector: 'app-bloqueo-horarios',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, 
    MatNativeDateModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './bloqueo-horarios.html',
  styleUrl: './bloqueo-horarios.css',
})
export class BloqueoHorarios implements OnInit {

  bloqueos: BloqueoHorario[] = [];
  fechaDesde!: Date;
  fechaHasta!: Date;
  horaDesde = '08:00';
  horaHasta = '18:00';
  motivo = '';
  horasLaborales: string[] = [];
  diaCompleto = false;
  configuracion!: ConfiguracionAgenda;
  horaInicioConfig!: string;
  horaFinConfig!: string;
  intervaloBase!: number;

  constructor(private bloqueo_service: BloqueoHorariosService, private toast_service: ToastService, 
    private spinner_service: SpinnerService, private configuracion_service: ConfiguracionService) {}
  
  ngOnInit(){
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.spinner_service.show();
    this.configuracion_service.getConfiguracion().subscribe({
      next: (config) => {
        this.configuracion = config;
        this.horaInicioConfig = config.horaInicio;
        this.horaFinConfig    = config.horaFin;
        this.intervaloBase    = config.intervaloBase;
        this.generarHorasLaborales();
        this.cargarBloqueos();
        this.spinner_service.hide();
      },
      error: (error) => {
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al cargar configuración de agenda', 'error');
      }
    });
  }

  cargarBloqueos() {
    this.spinner_service.show();
    this.bloqueo_service.getBloqueos().subscribe({
      next: (bloqueos) => {
        this.bloqueos = bloqueos;
        this.spinner_service.hide();
      },
      error: (error) => {
        this.spinner_service.hide();  
        console.error(error);
        this.toast_service.show(error?.error ?? 'Error al cargar los bloqueos de horarios.', 'error');
      }
    });
  }

  generarHorasLaborales() {
    let [hIni, mIni] = this.horaInicioConfig.split(':').map(Number);
    let [hFin, mFin] = this.horaFinConfig.split(':').map(Number);
    let inicioMin = hIni * 60 + mIni;
    let finMin = hFin * 60 + mFin;

    this.horasLaborales = [];

    for (let m = inicioMin; m <= finMin; m += this.intervaloBase) {
      let h   = Math.floor(m / 60);
      let min = m % 60;
      this.horasLaborales.push(
        `${h.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}`
      );
    }
  }

  onDiaCompletoChange() {
    if (this.diaCompleto && this.fechaDesde) {
      this.fechaHasta = new Date(this.fechaDesde);
    }
  }

  guardar() {
    if (!this.diaCompleto && (!this.fechaDesde || !this.fechaHasta)) {
      this.toast_service.show('Debe ingresar fecha desde y hasta', 'error');
      return;
    }

    if (this.fechaDesde > this.fechaHasta) {
      this.toast_service.show('La fecha desde no puede ser mayor a la fecha hasta', 'error');
      return;
    }

    if (!this.diaCompleto && this.horaDesde >= this.horaHasta) {
      this.toast_service.show('La hora desde debe ser menor a la hora hasta', 'error');
      return;
    }

    let desde = new Date(this.fechaDesde);
    let hasta = new Date(this.fechaHasta);
    let [hIni, mIni] = this.horaInicioConfig.split(':').map(Number);
    let [hFin, mFin] = this.horaFinConfig.split(':').map(Number);

    if (this.diaCompleto) {
      desde.setHours(hIni, mIni, 0, 0);
      hasta.setHours(hFin, mFin, 0, 0);
    } else {
      let [hd, md] = this.horaDesde.split(':').map(Number);
      let [hh, mh] = this.horaHasta.split(':').map(Number);
      desde.setHours(hd, md, 0, 0);
      hasta.setHours(hh, mh, 0, 0);
    }

    if (desde >= hasta) {
      this.toast_service.show('El rango horario no es válido', 'error');
      return;
    }

    let bloqueo: BloqueoHorario = {
      fechaDesde: desde,
      fechaHasta: hasta,
      motivo: this.motivo
    };

    this.spinner_service.show();
    this.bloqueo_service.crear(bloqueo).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Bloqueo creado correctamente', 'success');
        this.limpiar();
        this.cargarBloqueos();
      },
      error: (error) => {
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al crear bloqueo', 'error');
      }
    });
  }


  eliminar(id: number) {
    this.spinner_service.show();
    this.bloqueo_service.eliminar(id).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Bloqueo eliminado', 'success');
        this.cargarBloqueos();
      },
      error: (error) => {
        this.spinner_service.hide();
        console.error(error);
        this.toast_service.show(error?.error ?? 'Error al eliminar el bloqueo', 'error');
      }
    });
  }

  limpiar() {
    this.fechaDesde = undefined!;
    this.fechaHasta = undefined!;
    this.horaDesde = this.horaInicioConfig;
    this.horaHasta = this.horaFinConfig;
    this.diaCompleto = false;
    this.motivo = '';
  }
}
