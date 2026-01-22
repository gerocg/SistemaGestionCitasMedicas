import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner-service';
import { PacientesService } from '../../services/pacientes-services';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CitaService } from '../../services/cita-service';
import { ToastService } from '../../services/toast-service';
import { ConfirmacionService } from '../../services/confirmar-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reporte-de-citas',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './reporte-de-citas.html',
  styleUrl: './reporte-de-citas.css',
})
export class ReporteDeCitas {
  filtroPacienteId: number | null = null;
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  filtroEstado: string | null = null;
  
  pacienteSeleccionado: string = '';
  pacientesFiltrados: any[] = [];
  esPaciente = false;
  resumen: any = null;
  detalle: any[] = [];
  consultoCitas = false;
  estadosCita = [
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'PendienteResultado', label: 'Pendiente de resultado' },
    { value: 'Realizada', label: 'Realizada' },
    { value: 'Inasistencia', label: 'Inasistencia' },
    { value: 'Cancelada', label: 'Cancelada' },
  ];

  constructor(private spinner_service: SpinnerService, private pacientes_service: PacientesService, 
    private cita_service: CitaService, private router: Router, private auth_service: AuthService,
    private toast_service: ToastService, private confirmacion_service: ConfirmacionService) { }

  ngOnInit(): void {
    this.esPaciente = this.auth_service.esPaciente();

    if (this.auth_service.esPaciente()) {
      this.cargarPacienteActual();
    }
  }

  buscarPacientes(texto: string) {
    if (!texto || texto.length < 3) {
      this.pacientesFiltrados = [];
      return;
    }

    this.pacientes_service.buscarPacientes(texto).subscribe(p => this.pacientesFiltrados = p);
  }

  mostrarPaciente = (paciente: any): string =>
    typeof paciente === 'string' ? paciente : paciente?.nombreCompleto ?? '';



  seleccionarPaciente(p: any) {
    this.pacienteSeleccionado = p.nombreCompleto;
    this.filtroPacienteId = p.id;
    this.pacientesFiltrados = [];
  }


  pacienteCambio(valor: string) {
    if (!valor) {
      this.filtroPacienteId = null;
      this.pacientesFiltrados = [];
      return;
    }

    this.buscarPacientes(valor);
  }

  buscarReporte() {
    let desde = this.fechaDesde ? this.fechaDesde.toISOString() : undefined;
    let hasta = this.fechaHasta ? this.fechaHasta.toISOString() : undefined;

    this.spinner_service.show();
    this.consultoCitas = true;
    this.cita_service.reporteCitas(this.filtroPacienteId ?? undefined, desde, hasta, this.filtroEstado ?? undefined).subscribe({
        next: (data: any) => {
          this.spinner_service.hide();
          console.log('Citas filtradas:', data);
          this.resumen = data.resumen;
          this.detalle = data.detalle;
        },
        error: (error: any) =>{
          this.spinner_service.hide();
          this.toast_service.show(error?.error ?? 'Error al generar reporte.', 'error');
          console.error('Error al generar reporte:', error);
        } 
      });
  }

  cargarPacienteActual() {
    this.spinner_service.show();
    this.pacientes_service.getDatosPaciente().subscribe({
      next: (p: any) => {
        this.spinner_service.hide();
        this.filtroPacienteId = p.id;
        this.buscarReporte();
      },
      error: (err: any) => {
        this.spinner_service.hide();
        this.toast_service.show(err?.error ?? 'Error al cargar paciente actual', 'error');
        console.error('Error al cargar paciente actual', err);
      }
    });
  }
}
