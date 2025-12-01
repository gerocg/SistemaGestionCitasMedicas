import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  constructor(private router: Router, private pacientes_service: PacientesService, private toast_service: ToastService, private spinner_service: SpinnerService) {}

  paso: number = 1;
  nombre: string = '';
  email: string = '';
  telefono: string= '';
  fechaNacimiento: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';

  registrarse() {
    const fechaISO = this.fechaNacimiento ? new Date(this.fechaNacimiento).toISOString() : '';

    if (this.contrasenia !== this.confirmarContrasenia) {
      this.toast_service.show('Las contraseñas no coinciden', 'error');
      return;
    }

    this.spinner_service.show();
    this.pacientes_service.Register(
      this.nombre,
      this.contrasenia,
      this.email,
      fechaISO,
      this.telefono
    ).subscribe({
      next: (data) => {
        this.spinner_service.hide();
        console.log('Registro exitoso:', data);
        this.toast_service.show('Registro exitoso!', 'success');
        this.router.navigate(['/login'], {state: { email: this.email }});
      },
      error: (error) => {
        this.spinner_service.hide();
        if (error.status === 409) {
          this.toast_service.show('El usuario ya existe.', 'error');
        } else {
          console.error('Error en el registro:', error);
          this.toast_service.show('Error en el registro', 'error');
        }
      }
    });
  }

  siguiente() {
    this.paso++;
  }

  atras() {
    this.paso--;
  }

  esUltimoPaso() {
    return this.paso === 3;
  }
}
