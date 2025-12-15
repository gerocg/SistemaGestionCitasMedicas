import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesService } from '../../services/pacientes-services';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { Cita } from '../interfaces/cita.interface';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-clinico.html',
  styleUrl: './historial-clinico.css',
})
export class HistorialClinico implements OnInit {

  citasPendientes: Cita[] = [];
  citasRealizadas: Cita[] = [];

  constructor(
    private pacientesService: PacientesService,
    private spinner: SpinnerService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.spinner.show();

    this.pacientesService.getHistorialClinico().subscribe({
      next: (citas: Cita[]) => {

        this.citasPendientes = citas.filter(
          c => !c.fechaRealizada
        );

        this.citasRealizadas = citas.filter(
          c => c.fechaRealizada
        );

        this.spinner.hide();
      },
      error: () => {
        this.toast.error('No se pudo cargar el historial clínico');
        this.spinner.hide();
      }
    });
  }
}
