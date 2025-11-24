import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';

@Component({
  selector: 'app-recuperar-contrasenia',
  imports: [RouterLink, FormsModule],
  templateUrl: './recuperar-contrasenia.html',
  styleUrl: './recuperar-contrasenia.css',
})
export class RecuperarContrasenia {
  email: string = '';
  
  constructor(private router: Router, private pacientes_service: PacientesService){}

  recuperarContrasena() {
    if (!this.email.trim()) {
      alert("Ingresá un e-mail válido");
      return;
    }

    this.pacientes_service.EnviarRecuperacionEmail(this.email).subscribe({
      next: () => {
        alert("Se envió un correo con instrucciones para recuperar la contraseña.");
        this.router.navigate(['/login']);
      },
      error: () => {
        alert("No se pudo enviar el correo. Verifique el e-mail.");
      }
    });
  }
}
