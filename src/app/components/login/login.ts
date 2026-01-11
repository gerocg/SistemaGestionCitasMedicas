import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {  
  usuario: string = '';
  contrasenia: string = '';

  constructor(private router: Router, private auth_service: AuthService, private toast_service: ToastService, private spinner_service: SpinnerService) {
    const state = history.state;
    if (state?.email) {
      this.usuario = state.email;
    } else {
      this.usuario = localStorage.getItem('ultimo_usuario') || '';
    }
  }

  login(){
    this.spinner_service.show();
    this.auth_service.login(this.usuario, this.contrasenia).subscribe({
      next: (data: any) => {
        this.spinner_service.hide();
        console.log('Login exitoso:', data);
        localStorage.setItem('token', data.token);
        this.auth_service.setSession(data.token, data.roles);
        localStorage.setItem('ultimo_usuario', this.usuario);
        if(data.requiereCambioContrasena) this.router.navigate(['/inicio/cambiarContrasenia']);
        else this.router.navigate(['/inicio']);
        this.toast_service.show('Bienvenido!', 'success');
        this.usuario = '';
        this.contrasenia = '';
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error en el login', 'error');
      }
    });
  }
}
