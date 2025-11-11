import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor() { }
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + 'api/Pacientes/register';

  public Register(usuario: string, contrasenia: string, nombre: string, email: string, direccion: string, fechaNacimiento: string, telefono: string) {
    return this.http.post<any>(this.urlBase, {
      usuario_paciente: usuario,
      contrasenia_paciente: contrasenia,
      nombre_completo_paciente: nombre,
      email: email,
      direccion: direccion,
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono
    });
  }

}
