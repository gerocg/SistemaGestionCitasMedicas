import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SpinnerService } from '../../services/spinner-service';
import { PacientesService } from '../../services/pacientes-services';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-consulta-pacientes',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './consulta-pacientes.html',
  styleUrl: './consulta-pacientes.css',
})
export class ConsultaPacientes {
  textoBusqueda: string = '';
  pacientes: any[] = [];
  consultoPacientes: boolean = false;
  
  constructor(private paciente_service: PacientesService, private spinner_service: SpinnerService, 
    private router: Router, private toast_service: ToastService) {}

  consultarPacientes() {
    if (!this.textoBusqueda || this.textoBusqueda.trim().length === 0) {
      this.pacientes = [];
      return;
    }

    this.spinner_service.show();
    this.consultoPacientes = true;
    this.paciente_service.consultaPacientes(this.textoBusqueda).subscribe({
      next: (data: any) => {
        this.spinner_service.hide();
        console.log('Citas filtradas:', data);
        this.pacientes = data;
      },
      error: (error: any) => {
        this.spinner_service.hide();
        this.toast_service.show(error?.error ?? 'Error al consultar pacientes', 'error');
        console.error('Error al filtrar pacientes:', error);
        this.pacientes = [];
      }
    });
  }

  navegarEditarPaciente(id: number) {
    this.router.navigate(['/inicio/editarPaciente', id], {
      queryParams: { mode: 'editar' }
    });
  }

  navegarVerPaciente(id: number) {
    this.router.navigate(['/inicio/verPaciente', id], {
      queryParams: { mode: 'ver' }
    });
  }
}
