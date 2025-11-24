import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
    constructor() { }
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/Pacientes';

    Login(usuario: string, contrasenia: string) {
        return this.http.post<any>(this.urlBase + "/login", {
            usuario_paciente: usuario,
            contrasenia_paciente: contrasenia
        });
    }

    Register(nombre: string, contrasenia: string, email: string, fechaNacimiento: string, telefono: string) {
        return this.http.post<any>(this.urlBase + "/register", {
            nombre_completo_paciente: nombre,
            email: email,
            contrasenia_paciente: contrasenia,
            fecha_nacimiento: fechaNacimiento,
            telefono: telefono
        });
    }

    EnviarRecuperacionEmail(email: string) {
        return this.http.post<any>(this.urlBase + "/recuperarEmail", {
            email: email
        });
    }

}
