import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PacientesService } from '../../services/pacientes-services';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-datos-personales',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './datos-personales.html',
  styleUrl: './datos-personales.css',
})
export class DatosPersonales implements OnInit {
  
usuario: any = {
    nombreCompleto: '',
    email: ''
  };

  paciente: any = {
    fechaNacimiento: null,
    telefono: '',
    direccion: ''
  };
  esPaciente = false;

  constructor(private spinner_service: SpinnerService, private toast_service: ToastService, private auth_service: AuthService,
    private usuario_service: UsuarioService, private pacientes_service: PacientesService) {}
  
ngOnInit(): void {
    this.esPaciente = this.auth_service.esPaciente();
    this.cargarUsuario();

    if (this.esPaciente) {
      this.cargarPaciente();
    }
  }

  cargarUsuario() {
    this.spinner_service.show();
    this.usuario_service.getMe().subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.spinner_service.hide();
      },
      error: (error: any) => {
        console.error('Error al cargar usuario:', error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al cargar los datos del usuario', 'error');
      }
    });
  }

  cargarPaciente() {
    this.spinner_service.show();
    this.pacientes_service.getDatosPaciente().subscribe({
      next: (data: any) => {
        this.paciente = data;
        this.spinner_service.hide();
      },
      error: (error: any) => {
        console.error('Error al cargar paciente:', error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al cargar los datos del paciente', 'error');
      }
    });
  }

  guardar() {
    if (!this.usuario.nombreCompleto || !this.usuario.email) {
      this.toast_service.show('Debe completar los campos obligatorios', 'error');
      return;
    }

    this.spinner_service.show();
    this.usuario_service.updateMe({nombreCompleto: this.usuario.nombreCompleto, email: this.usuario.email}).subscribe({
      next: () => {
        if (this.esPaciente) {
          this.actualizarPaciente();
        } else {
          this.spinner_service.hide();
          this.toast_service.show('Datos actualizados correctamente', 'success');
        }
      },
      error: (error: any) => {
        console.error('Error al actualizar usuario:', error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al guardar los datos', 'error');
      }
    });
  }

  actualizarPaciente() {
    this.pacientes_service.actualizarDatos({fechaNacimiento: this.paciente.fechaNacimiento, telefono: this.paciente.telefono, direccion: this.paciente.direccion}).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Datos actualizados correctamente', 'success');
      },
      error: (error: any) => {
        console.error('Error al actualizar paciente:', error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al guardar los datos del paciente', 'error');
      }
    });
  }
}
