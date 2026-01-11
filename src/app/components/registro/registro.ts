import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, CommonModule, RouterLink,   MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  constructor(private router: Router, private auth_service: AuthService, private toast_service: ToastService, private spinner_service: SpinnerService) {}

  paso: number = 1;
  nombre: string = '';
  email: string = '';
  telefono: string= '';
  fechaNacimiento: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';

  registrarse() {
    if(this.pasoValido()){
      const fechaISO = this.fechaNacimiento ? new Date(this.fechaNacimiento).toISOString() : '';
  
      if (this.contrasenia !== this.confirmarContrasenia) {
        this.toast_service.show('Las contraseñas no coinciden', 'error');
        return;
      }
  
      this.spinner_service.show();
      this.auth_service.register(this.nombre, this.contrasenia, this.email, fechaISO, this.telefono
      ).subscribe({
        next: (data: any) => {
          this.spinner_service.hide();
          console.log('Registro exitoso:', data);
          this.toast_service.show('Registro exitoso!', 'success');
          this.router.navigate(['/login'], {state: { email: this.email }});
        },
        error: (error: any) => {
          this.spinner_service.hide();
          this.toast_service.show(error?.error ?? 'Error en el registro', 'error');
          console.error('Error en el registro:', error);
        }
      });
    } else {
      this.toast_service.show('Debe completar todos los campos obligatorios.', 'error');
    }
  }

  siguiente() {
    if (!this.pasoValido()) {
      this.toast_service.show('Debe completar todos los campos obligatorios.', 'error');
      return;
    }

    this.paso++;
  }

  pasoValido(): boolean {
    switch (this.paso) {
      case 1:
        return !!this.nombre && !!this.email;
      case 2:
        return !!this.telefono && !!this.fechaNacimiento;
      case 3:
        return !!this.contrasenia && !!this.confirmarContrasenia && this.contrasenia === this.confirmarContrasenia;
      default:
        return false;
    }
  }

  atras() {
    this.paso--;
  }

  esUltimoPaso() {
    return this.paso === 3;
  }
}
