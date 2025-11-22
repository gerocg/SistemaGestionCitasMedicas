import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterService } from '../../services/register-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
   RegisterService = inject(RegisterService);
  constructor(private router: Router) {}

  usuario = '';
  contrasenia = '';
  confirmarContrasenia = '';
  nombre = '';
  email = '';
  direccion = '';
  fechaNacimiento = '';
  telefono = '';

  onRegister() {
    const fechaISO = this.fechaNacimiento ? new Date(this.fechaNacimiento).toISOString() : '';

    if (this.contrasenia !== this.confirmarContrasenia) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.RegisterService.Register(
      this.usuario,
      this.contrasenia,
      this.nombre,
      this.email,
      this.direccion,
      fechaISO,
      this.telefono
    ).subscribe({
      next: (data) => {
        console.log('Registro exitoso:', data);
        localStorage.setItem('usuario', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        if (error.status === 409) {
          alert('El nombre de usuario ya existe. Por favor, elija otro.');
        } else {
          console.error('Error en el registro:', error);
        }
      }
    });
  }
}
