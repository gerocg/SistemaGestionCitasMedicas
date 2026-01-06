  import { Component, OnInit } from '@angular/core';
  import { SpinnerService } from '../../services/spinner-service';
  import { PacientesService } from '../../services/pacientes-services';
  import { CitaService } from '../../services/cita-service';
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
  import { Router } from '@angular/router';
  import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { ConfirmacionService } from '../../services/confirmar-service';


  @Component({
    selector: 'app-consulta-citas',
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatTableModule, MatIconModule, MatButtonModule],
    templateUrl: './consulta-citas.html',
    styleUrl: './consulta-citas.css',
  })
  export class ConsultaCitas implements OnInit {
    filtroPacienteId: number | null = null;
    fechaDesde: Date | null = null;
    fechaHasta: Date | null = null;
    
    citas: any[] = [];
    pacientes: any[] = [];
    pacienteSeleccionado: any = null;
    esPaciente = false;
    consultoCitas = false;
    estadosCita = [
      { value: 'Confirmada', label: 'Confirmada' },
      { value: 'PendienteResultado', label: 'Pendiente de resultado' },
      { value: 'Realizada', label: 'Realizada' },
      { value: 'Inasistencia', label: 'Inasistencia' },
      { value: 'Cancelada', label: 'Cancelada' },
    ];
    filtroEstado: string | null = null;

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
        this.pacientes = [];
        return;
      }

      this.pacientes_service.buscarPacientes(texto).subscribe(p => this.pacientes = p);
    }

    seleccionarPaciente(paciente: any) {
      this.pacienteSeleccionado = paciente;
      this.filtroPacienteId = paciente.id;
      this.pacientes = [];
    }

    mostrarPaciente(paciente: any): string {
      return paciente ? paciente.nombreCompleto : '';
    }

    buscarCitas() {
      let desde = this.fechaDesde ? this.fechaDesde.toISOString() : undefined;
      let hasta = this.fechaHasta ? this.fechaHasta.toISOString() : undefined;

      this.spinner_service.show();
      this.consultoCitas = true;
      this.cita_service.filtrarCitas(this.filtroPacienteId ?? undefined, desde, hasta, this.filtroEstado ?? undefined).subscribe({
          next: (data) => {
            this.spinner_service.hide();
            console.log('Citas filtradas:', data);
            this.citas = data;
          },
          error: (error) =>{
            this.spinner_service.hide();
            console.error('Error al filtrar citas:', error);
          } 
        });
    }

    cargarPacientes() {
      this.spinner_service.show();
      this.pacientes_service.getPacientes().subscribe({
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

    cargarPacienteActual() {
      this.spinner_service.show();
      this.pacientes_service.getDatosPaciente().subscribe({
        next: (p: any) => {
          this.spinner_service.hide();
          this.filtroPacienteId = p.id;
          this.pacientes = [
            { id: p.id, nombreCompleto: p.nombreCompleto }
          ];
          this.buscarCitas();
        },
        error: err => {
          this.spinner_service.hide();
          console.error('Error al cargar paciente actual', err);
        }
      });
    }

    cancelarCita(id: number) {
      this.confirmacion_service.confirmar({
        titulo: 'Cancelar cita',
        mensaje: '¿Seguro que desea cancelar esta cita?',
        textoConfirmar: 'Si',
        textoCancelar: 'No'
      }).subscribe(confirmado => {
        if (!confirmado) return;
        this.spinner_service.show();
        this.cita_service.eliminarCita(id).subscribe({
          next: () => {
            this.spinner_service.hide();
            this.toast_service.show("Cita cancelada exitosamente", 'success');
            this.buscarCitas();
          },
          error: () => {
            this.spinner_service.hide();
            this.toast_service.show("Error al cancelar la cita", 'error');
          }
        });
      });
    }

    puedeEditar(cita: any): boolean {
      return (cita.estado === 'Pendiente' || cita.estado === 'Confirmada') && new Date(cita.fecha) > new Date() && !this.esPaciente;
    }

    navegarEditarCita(id: number) {
      this.router.navigate(['/inicio/editarCita', id], {
        queryParams: { mode: 'editar' }
      });
    }

    navegarVerCita(id: number) {
      this.router.navigate(['/inicio/verCita', id], {
        queryParams: { mode: 'ver' }
      });
    }

    puedeCancelar(cita: any): boolean {
      return cita.estado === 'Confirmada' && new Date(cita.fecha) > new Date();
    }

    cambiarEstado(citaId: number, estado: string) {
      this.confirmacion_service.confirmar({
        titulo: 'Cancelar cita',
        mensaje: '¿Seguro que desea cancelar esta cita?',
        textoConfirmar: 'Si',
        textoCancelar: 'No'
      }).subscribe(confirmado => {
        if (!confirmado) return;

        this.spinner_service.show();
        this.cita_service.cambiarEstado(citaId, estado).subscribe({
          next: () => {
            this.spinner_service.hide();
            this.toast_service.show("Estado cambiado exitosamente", 'success');
            this.buscarCitas();
          },
          error: () => {
            this.spinner_service.hide();
            this.toast_service.show("Error al cambiar el estado", 'error');
            alert('No se pudo cambiar el estado');
          }
        });
      });
    }

    puedeCambiarEstado(cita: any): boolean {
      if (this.esPaciente) return false;
      return cita.estado === 'PendienteResultado';
    }
  }
