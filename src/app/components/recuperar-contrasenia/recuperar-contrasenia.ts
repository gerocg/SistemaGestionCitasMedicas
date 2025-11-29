import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-recuperar-contrasenia',
  imports: [RouterLink, FormsModule],
  templateUrl: './recuperar-contrasenia.html',
  styleUrl: './recuperar-contrasenia.css',
})
export class RecuperarContrasenia {
  email: string = '';
  
  constructor(private router: Router, private pacientes_service: PacientesService, private toast_service: ToastService){}

  recuperarContrasena() {
    if (!this.email.trim()) {
      this.toast_service.show('Ingresá un e-mail válido', 'error');
      return;
    }

    this.pacientes_service.EnviarRecuperacionEmail(this.email).subscribe({
      next: () => {
        this.toast_service.show('Correo enviado con éxito', 'success');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toast_service.show('No se pudo enviar el correo. Verifique el e-mail.', 'error');
      }
    });
  }
}
