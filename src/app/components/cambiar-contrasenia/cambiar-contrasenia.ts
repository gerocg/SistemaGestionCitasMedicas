import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-cambiar-contrasenia',
  imports: [FormsModule, CommonModule],
  templateUrl: './cambiar-contrasenia.html',
  styleUrl: './cambiar-contrasenia.css',
})
export class CambiarContrasenia {

  contrasenia: string = '';
  confirmarContrasenia: string = '';

  constructor(private router: Router, private auth_service: AuthService, private toast_service: ToastService, private spinner_service: SpinnerService) {}
  
  cambiarContrasenia() {
    if (!this.contrasenia || this.contrasenia !== this.confirmarContrasenia) {
      this.toast_service.show("Las contraseñas no coinciden", "error");
      return;
    }

    this.spinner_service.show();
    this.auth_service.CambiarContrasenia(this.contrasenia).subscribe({
      next: (data: any) => {
      this.spinner_service.hide();
      this.toast_service.show('Cambio de contraseña exitoso!', 'success');
      this.contrasenia = '';
      this.confirmarContrasenia = '';
      this.router.navigate(['/inicio']);
      },
      error: (error: any) => {
        console.error('Error al cambiar la contraseña:', error);
        this.spinner_service.hide();
        this.toast_service.show('Error al cambiar la contraseña.', 'error');
      }
    });
  }

}
