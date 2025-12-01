import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';
import { SpinnerService } from '../../services/spinner-service';

@Component({
  selector: 'app-recuperar-contrasenia',
  imports: [RouterLink, FormsModule],
  templateUrl: './recuperar-contrasenia.html',
  styleUrl: './recuperar-contrasenia.css',
})
export class RecuperarContrasenia {
  email: string = '';
  
  constructor(private router: Router, private pacientes_service: PacientesService, private toast_service: ToastService, private spinner_service: SpinnerService){
    this.email = localStorage.getItem('ultimo_usuario') || '';
  }

  recuperarContrasena() {
    if (!this.email.trim()) {
      this.toast_service.show('Ingresá un e-mail válido', 'error');
      return;
    }
    this.spinner_service.show();
    this.pacientes_service.EnviarRecuperacionContrasenaEmail(this.email).subscribe({
      next: () => {
        this.spinner_service.hide();
        this.toast_service.show('Correo enviado con éxito', 'success');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.spinner_service.hide();
        this.toast_service.show('No se pudo enviar el correo. Verifique el e-mail.', 'error');
      }
    });
  }
}
