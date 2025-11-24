import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacientesService } from '../../services/pacientes-services';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  constructor(private router: Router, private pacientes_service: PacientesService) {}

  paso: number = 1;
  nombre: string = '';
  email: string = '';
  telefono: string= '';
  fechaNacimiento: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';

  onRegister() {
    const fechaISO = this.fechaNacimiento ? new Date(this.fechaNacimiento).toISOString() : '';

    if (this.contrasenia !== this.confirmarContrasenia) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.pacientes_service.Register(
      this.nombre,
      this.contrasenia,
      this.email,
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
