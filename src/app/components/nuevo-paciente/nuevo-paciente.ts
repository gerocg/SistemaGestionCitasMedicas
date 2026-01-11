import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import { PacientesService } from '../../services/pacientes-services';
import { SpinnerService } from '../../services/spinner-service';

@Component({
  selector: 'app-nuevo-paciente',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './nuevo-paciente.html',
  styleUrl: './nuevo-paciente.css',
})
export class NuevoPaciente implements OnInit{
  nombreCompleto = '';
  email = '';
  telefono = '';
  fechaNacimiento!: Date;
  pacienteId: number | null = null;
  modoEdicion = false;
  modoVista: boolean = false;

  constructor(private pacientes_service: PacientesService, private toast_service: ToastService, private router: Router, private spinner_service: SpinnerService, private activated_route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.activated_route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.modoVista = mode === 'ver';
    });

    const id = this.activated_route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteId = +id;
      this.modoEdicion = true;
      this.cargarPaciente(this.pacienteId);
    }
  }

  cargarPaciente(id: number) {
    this.spinner_service.show();
    this.pacientes_service.getPaciente(id).subscribe({
      next: (data: any) => {
        this.nombreCompleto = data.nombreCompleto;
        this.email = data.email;
        this.telefono = data.telefono;
        this.fechaNacimiento = data.fechaNacimiento;
        this.spinner_service.hide();
      },
      error: (error: any) => {
        this.spinner_service.hide();
        console.error('Error al cargar el paciente:', error);
        this.toast_service.show(error?.error ?? 'Error al cargar el paciente', 'error');
      }
    });
  }

  registrarPaciente() {
    const dto = {
      nombreCompleto: this.nombreCompleto,
      email: this.email,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento
    };

    this.spinner_service.show();
    this.pacientes_service.crearPaciente(dto).subscribe({
      next: () => {
        this.toast_service.show('Paciente creado correctamente', 'success');
        this.router.navigate(['/inicio/calendario']);
        this.spinner_service.hide();
      },
      error: (error: any) => {
        this.toast_service.show(error?.error ?? 'Error al crear paciente', 'error');
        this.spinner_service.hide();
      }
    });
  }

  actualizarPaciente() {
    if (!this.pacienteId) return;

    const dto = {
      nombreCompleto: this.nombreCompleto,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento
    };

    this.spinner_service.show();
    this.pacientes_service.actualizarPaciente(this.pacienteId, dto).subscribe({
      next: () => {
        this.toast_service.show('Paciente actualizado correctamente', 'success');
        this.router.navigate(['/inicio/calendario']);
        this.spinner_service.hide();
      },
      error: (error: any) => {
        this.toast_service.show(error?.error ?? 'Error al actualizar el paciente', 'error');
        this.spinner_service.hide();
      }
    });
  }
}
