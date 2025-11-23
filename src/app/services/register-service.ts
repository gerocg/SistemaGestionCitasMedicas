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

  public Register(nombre: string, contrasenia: string, email: string, fechaNacimiento: string, telefono: string) {
    return this.http.post<any>(this.urlBase, {
      nombre_completo_paciente: nombre,
      email: email,
      contrasenia_paciente: contrasenia,
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono
    });
  }

}