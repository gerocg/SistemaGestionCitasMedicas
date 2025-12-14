import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacientesService } from '../../services/pacientes-services';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit  {
  
  form!: FormGroup;
  idUsuario!: number; // lo obtenés según cómo manejen el login

   constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private spinner: SpinnerService,
    private toast: ToastService
  ) {}

   ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: [''],
      telefono: [''],
    });

    this.idUsuario = 1; // ejemplo. Cambialo según cómo manejen session/localStorage

    this.cargarDatos();
  }

  cargarDatos() {
    this.spinner.show();

    this.pacientesService.ObtenerDatosPaciente(this.idUsuario).subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre: data.nombre_completo_paciente,
          email: data.email,
          fechaNacimiento: data.fecha_nacimiento,
          telefono: data.telefono
        });
        this.spinner.hide();
      },
      error: () => {
        this.toast.error("No se pudieron cargar los datos del usuario");
        this.spinner.hide();
      }
    });
  }
  guardar() {
    if (this.form.invalid) {
      this.toast.error("Hay campos inválidos");
      return;
    }

    const payload = {
      id: this.idUsuario,
      nombre_completo_paciente: this.form.value.nombre,
      email: this.form.value.email,
      fecha_nacimiento: this.form.value.fechaNacimiento,
      telefono: this.form.value.telefono
    };

    this.spinner.show();

    this.pacientesService.ActualizarPaciente(payload).subscribe({
      next: () => {
        this.toast.success("Datos actualizados");
        this.spinner.hide();
      },
      error: () => {
        this.toast.error("Error al actualizar");
        this.spinner.hide();
      }
    });
  }

}
