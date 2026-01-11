import { Component, inject } from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';

@Component({
  selector: 'app-calendario-configuracion',
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './calendario-configuracion.html',
  styleUrl: './calendario-configuracion.css',
})

export class CalendarioConfiguracion {
  horasLaborales: string[] = [];
  horaInicio = '08:00';
  horaFin = '18:00';
  intervaloBase = 30;
  duracionGenerica = 30;

  constructor(private configuracion_service: ConfiguracionService, private toast_service: ToastService, private spinner_service: SpinnerService) {}

  ngOnInit() {
    this.generarHorasLaborales();
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    this.spinner_service.show();
    this.configuracion_service.getConfiguracion().subscribe({
      next: (config) => {
        this.horaInicio = config.horaInicio;
        this.horaFin = config.horaFin;
        this.intervaloBase = config.intervaloBase;
        this.duracionGenerica = config.duracionGenerica;
        console.log(config)
        this.spinner_service.hide();
      },
      error: (error) => {
        this.spinner_service.hide();  
        console.error(error);
        this.toast_service.show(error?.error ?? 'Error al cargar la configuración del calendario.', 'error');
      }
    });
  }


  guardarConfiguracion() {
    // if(!this.horaInicio || !this.horaFin || !this.intervaloBase || !this.duracionGenerica) {
    //   this.toast_service.show('Debe completar todos los campos.', 'error');
    //   return;
    // }

    // if(this.horaInicio >= this.horaFin) {
    //   this.toast_service.show('La hora de inicio debe ser anterior a la hora de fin.', 'error');
    //   return;
    // }

    // if(this.intervaloBase <= 0) {
    //   this.toast_service.show('El intervalo base debe ser mayor que cero.', 'error');
    //   return;
    // }
    let configNueva = {
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      intervaloBase: this.intervaloBase,
      duracionGenerica: this.duracionGenerica
    };

    this.spinner_service.show();
    this.configuracion_service.guardarConfiguracion(configNueva).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Configuración guardada correctamente.', 'success');
      },
      error: (error) => {
        console.error(error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al guardar la configuración.', 'error');
      }
    });
  }

  generarHorasLaborales() {
    let horaInicio = 6;
    let horaFin = 22;  
    let intervalo = 30;  
    this.horasLaborales = [];

    for (let minutos = horaInicio * 60; minutos <= horaFin * 60; minutos += intervalo) {
      let h = Math.floor(minutos / 60);
      let m = minutos % 60;

      this.horasLaborales.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
}
