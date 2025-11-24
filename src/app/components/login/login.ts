import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';


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

  constructor(private router: Router, private pacientes_service: PacientesService) { }

  onLogin(){
    this.pacientes_service.Login(this.usuario, this.contrasenia).subscribe({
      next: (data) => {
        console.log('Login exitoso:', data);
        localStorage.setItem('usuario', JSON.stringify(data));
        this.router.navigate(['/inicio']);
        this.usuario = '';
        this.contrasenia = '';
      },
      error: (error) => {
        console.error('Error en el login:', error);
      }
    });
  }
}
