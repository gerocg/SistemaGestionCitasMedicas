import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacientesService } from '../../services/pacientes-services';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { Cita } from '../interfaces/cita.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { MatCardModule } from '@angular/material/card';
import { CitaService } from '../../services/cita-service';
import { environment } from '../../../environments/environment.development';
import { ConfirmacionService } from '../../services/confirmar-service';


@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatCardModule],
  templateUrl: './historial-clinico.html',
  styleUrl: './historial-clinico.css',
})
export class HistorialClinico implements OnInit {

  pacientes: any[] = [];
  pacienteSeleccionado: any = null;
  citas: any[] = [];
  consultaHistorial: boolean = false;
  apiUrl: string = environment.apiURL;

  constructor(
    private pacientes_service: PacientesService, private spinner: SpinnerService, 
    private toast_service: ToastService, private auth_service: AuthService, private cita_service: CitaService,
    private confirmacion_service: ConfirmacionService) {}

  ngOnInit() {
    if (this.auth_service.esPaciente()) {
      this.consultaHistorial = true;
      this.cargarMiHistorial();
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
    this.pacientes = [];
    this.consultaHistorial = false;
  }

  consultarHistorial(){
    if (this.pacienteSeleccionado) {
      this.consultaHistorial = true;
      this.cargarHistorial(this.pacienteSeleccionado.id);
    }
  }

  cargarHistorial(id: number) {
    this.spinner.show();
    this.pacientes_service.getHistorialClinico(id).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.citas = data.citas;
      },
      error: (error) => {
        this.spinner.hide();
        this.toast_service.show(error?.error ?? 'No se pudo cargar el historial clínico', 'error');
      }
    });
  }

  cargarMiHistorial() {
    this.spinner.show();
    this.pacientes_service.getMiHistorialClinico().subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.citas = data.citas;
        this.pacienteSeleccionado = data.paciente;
      },
      error: (error) => {
        this.spinner.hide();
        this.toast_service.show(error?.error ?? 'No se pudo cargar el historial clínico', 'error');
      }
    });
  }


  esAdminProfesional(): boolean {
    return this.auth_service.esAdmin() || this.auth_service.esProfesional();
  }

  mostrarPaciente(paciente: any): string {
    return paciente ? paciente.nombreCompleto : '';
  }

  subirArchivo(event: any, citaId: number) {
    let archivo = event.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    this.spinner.show();
    this.cita_service.subirArchivoCita(citaId, formData).subscribe({
      next: () => {
        this.spinner.hide();
        this.toast_service.show('Archivo adjuntado correctamente', "success");
        this.consultaHistorial = true;
        this.cargarHistorial(this.pacienteSeleccionado.id);
      },
      error: (error) => {
        this.spinner.hide();
        this.toast_service.show(error?.error ?? 'Error al subir el archivo', 'error');
      }
    });
  }

  eliminarArchivo(archivoId: number, citaId: number) {
    this.confirmacion_service.confirmar({
      titulo: 'Eliminar archivo',
      mensaje: '¿Seguro que desea eliminar este archivo?',
      textoConfirmar: 'Si',
      textoCancelar: 'No'
    }).subscribe(confirmado => {
      if (!confirmado) return;
      this.spinner.show();
      this.cita_service.eliminarArchivo(archivoId).subscribe({
        next: () => {
          this.spinner.hide();
          this.toast_service.show('Archivo eliminado correctamente', 'success');
          this.cargarHistorial(this.pacienteSeleccionado.id);
        },
        error: (error) => {
          this.spinner.hide();
          this.toast_service.show(error?.error ?? 'No se pudo eliminar el archivo', 'error');
        }
      });
    });
  }

}