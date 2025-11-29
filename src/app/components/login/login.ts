import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {  
  usuario: string = '';
  contrasenia: string = '';

  constructor(private router: Router, private pacientes_service: PacientesService, private toast_service: ToastService, private spinner_service: SpinnerService) {
    const state = history.state;
    if (state?.email) {
      this.usuario = state.email;
    } else {
      this.usuario = localStorage.getItem('ultimo_usuario') || '';
    }
  }

  onLogin(){
    this.spinner_service.show();
    this.pacientes_service.Login(this.usuario, this.contrasenia).subscribe({
      next: (data) => {
      this.spinner_service.hide();
      console.log('Login exitoso:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('ultimo_usuario', this.usuario);
      this.router.navigate(['/inicio']);
      this.toast_service.show('Bienvenido!', 'success');
      this.usuario = '';
      this.contrasenia = '';

      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.spinner_service.hide();
        this.toast_service.show('Error en el login.', 'error');
      }
    });
  }
}
