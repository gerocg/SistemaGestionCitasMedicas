import { Component } from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendario-configuracion',
  imports: [FormsModule, CommonModule],
  templateUrl: './calendario-configuracion.html',
  styleUrl: './calendario-configuracion.css',
})

export class CalendarioConfiguracion {
  horasLaborales: string[] = [];
  horaInicio = '08:00';
  horaFin = '18:00';
  intervaloBase = 30;
  duracionGenerica = 30;

  constructor(private configuracion_service: ConfiguracionService) {}

  ngOnInit() {
    this.generarHorasLaborales();
    const config = this.configuracion_service.getConfiguracion();
    this.horaInicio = config.horaInicio;
    this.horaFin = config.horaFin;
    this.intervaloBase = config.intervaloBase;
    this.duracionGenerica = config.duracionGenerica;
  }

  guardarConfiguracion() {
    this.configuracion_service.setConfiguracion({
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      intervaloBase: this.intervaloBase,
      duracionGenerica: this.duracionGenerica
    });
  }

    generarHorasLaborales() {
      const horaInicio = 6;
      const horaFin = 22;  
      const intervalo = 30;  

      this.horasLaborales = [];

      for (let minutos = horaInicio * 60; minutos <= horaFin * 60; minutos += intervalo) {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;

        this.horasLaborales.push(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        );
      }
  }
}
